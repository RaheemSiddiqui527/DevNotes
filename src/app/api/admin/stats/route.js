import { NextResponse } from 'next/server'
import { ensureConnected, getUserFromRequest } from '@/lib/server/auth'
import mongoose from 'mongoose'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAdmin(user) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!(user?.email && list.includes(String(user.email).toLowerCase()))
}

// Minimal duplicate schemas to avoid importing internals
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'users' })
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)

const FileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  type: String,
  size: Number,
  relPath: String,
  folder: String,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'files' })
const FileModel = mongoose.models.UserFile || mongoose.model('UserFile', FileSchema)

const EventSchema = new mongoose.Schema({
  type: { type: String, index: true }, // 'login' | 'upload'
  userId: mongoose.Schema.Types.ObjectId,
  userEmail: String,
  meta: Object,
  createdAt: { type: Date, default: Date.now, index: true },
}, { collection: 'events' })
const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema)

export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await ensureConnected()

  const [userCount, fileCount] = await Promise.all([
    UserModel.countDocuments({}),
    FileModel.countDocuments({}),
  ])

  const recentUploads = await EventModel.find({ type: 'upload' })
    .sort({ createdAt: -1 }).limit(5).lean()
  const uploads = recentUploads.map(e => ({
    id: String(e._id),
    when: e.createdAt,
    email: e.userEmail,
    count: e.meta?.count || 0,
    folder: e.meta?.folder || null,
  }))

  const since = new Date(Date.now() - 24 * 3600 * 1000)
  const loginLast24h = await EventModel.countDocuments({ type: 'login', createdAt: { $gte: since } })

  return NextResponse.json({
    userCount,
    fileCount,
    loginLast24h,
    recentUploads: uploads,
  })
}
