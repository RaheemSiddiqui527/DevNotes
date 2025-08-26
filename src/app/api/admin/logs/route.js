import { NextResponse } from 'next/server'
import { ensureConnected, getUserFromRequest } from '@/lib/server/auth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAdmin(user) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!(user?.email && list.includes(String(user.email).toLowerCase()))
}

const EventSchema = new mongoose.Schema({
  type: { type: String, index: true },
  userId: mongoose.Schema.Types.ObjectId,
  userEmail: String,
  meta: Object,
  createdAt: { type: Date, default: Date.now, index: true },
}, { collection: 'events' })
const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema)

export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const type = url.searchParams.get('type') // optional filter
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '200', 10), 1000)

  const filter = type ? { type } : {}
  const events = await EventModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean()
  const items = events.map(e => ({ id: String(e._id), type: e.type, email: e.userEmail, meta: e.meta || {}, when: e.createdAt }))
  return NextResponse.json({ events: items })
}
