import { NextResponse } from 'next/server'
import { ensureConnected, getUserFromRequest } from '@/lib/server/auth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAdminEnv(user) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!(user?.email && list.includes(String(user.email).toLowerCase()))
}

// Settings model for DB-based admin emails (optional)
const SettingsSchema = new mongoose.Schema({ key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed }, { collection: 'settings' })
const SettingsModel = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)

async function isAdmin(user) {
  if (isAdminEnv(user)) return true
  try {
    const s = await SettingsModel.findOne({ key: 'adminEmails' }).lean()
    const list = Array.isArray(s?.value) ? s.value.map(e => String(e).toLowerCase()) : []
    return !!(user?.email && list.includes(String(user.email).toLowerCase()))
  } catch (_) {
    return false
  }
}

const CheatSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true, index: true },
  label: { type: String, required: true, trim: true },
  code: { type: String, required: true },
  desc: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'cheatsheets' })

const CheatModel = mongoose.models.Cheatsheet || mongoose.model('Cheatsheet', CheatSchema)

export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').toLowerCase()
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '200', 10), 500)

  const filter = q ? { $or: [
    { category: new RegExp(q, 'i') },
    { label: new RegExp(q, 'i') },
    { desc: new RegExp(q, 'i') },
    { code: new RegExp(q, 'i') },
  ] } : {}

  const items = await CheatModel.find(filter).sort({ updatedAt: -1 }).limit(limit).lean()
  const cheats = items.map(i => ({ id: String(i._id), category: i.category, label: i.label, code: i.code, desc: i.desc, updatedAt: i.updatedAt }))
  return NextResponse.json({ cheats })
}

export async function POST(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { id, category, label, code, desc } = body
  if (!category || !label || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  if (id) {
    await CheatModel.updateOne({ _id: id }, { $set: { category, label, code, desc, updatedAt: new Date() } })
    return NextResponse.json({ ok: true, id })
  } else {
    const doc = await CheatModel.create({ category, label, code, desc })
    return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 })
  }
}

export async function DELETE(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  await CheatModel.deleteOne({ _id: id })
  return NextResponse.json({ ok: true })
}
