import { NextResponse } from 'next/server'
import { ensureConnected, getUserFromRequest } from '@/lib/server/auth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAdminEnv(user) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!(user?.email && list.includes(String(user.email).toLowerCase()))
}

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

export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const s = await SettingsModel.findOne({ key: 'adminEmails' }).lean()
  const emails = Array.isArray(s?.value) ? s.value : []
  return NextResponse.json({ adminEmails: emails })
}

export async function POST(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  let emails = body.adminEmails
  if (!Array.isArray(emails)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  emails = emails.map(e => String(e).toLowerCase().trim()).filter(Boolean)
  await SettingsModel.updateOne({ key: 'adminEmails' }, { $set: { value: emails } }, { upsert: true })
  return NextResponse.json({ ok: true, adminEmails: emails })
}
