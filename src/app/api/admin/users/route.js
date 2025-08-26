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
  } catch (_) { return false }
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  passwordHash: String,
  role: { type: String, default: 'user' }, // user | moderator | admin
  status: { type: String, default: 'active' }, // active | inactive | suspended
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'users' })
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)

const FileSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, createdAt: { type: Date, default: Date.now } }, { collection: 'files' })
const FileModel = mongoose.models.UserFile || mongoose.model('UserFile', FileSchema)

const EventSchema = new mongoose.Schema({ type: String, userEmail: String, createdAt: { type: Date, default: Date.now } }, { collection: 'events' })
const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema)

export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const search = (url.searchParams.get('search') || '').toLowerCase().trim()
  const role = url.searchParams.get('role') || ''
  const status = url.searchParams.get('status') || ''
  const sortBy = url.searchParams.get('sortBy') || 'created'
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') === 'asc' ? 1 : -1
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '200', 10), 1000)
  const skip = Math.max(parseInt(url.searchParams.get('skip') || '0', 10), 0)

  const filter = {}
  if (search) filter.$or = [ { name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') } ]
  if (role && role !== 'all') filter.role = role
  if (status && status !== 'all') filter.status = status

  const sortMap = {
    name: { name: sortOrder },
    email: { email: sortOrder },
    role: { role: sortOrder },
    status: { status: sortOrder },
    lastLogin: { lastLogin: sortOrder },
    created: { createdAt: sortOrder },
  }
  const sort = sortMap[sortBy] || { createdAt: sortOrder }

  const users = await UserModel.find(filter).sort(sort).skip(skip).limit(limit).lean()

  // Aggregate login counts and lastLogin from events
  const emails = users.map(u => u.email)
  const eventAgg = await EventModel.aggregate([
    { $match: { type: 'login', userEmail: { $in: emails } } },
    { $group: { _id: '$userEmail', count: { $sum: 1 }, lastLogin: { $max: '$createdAt' } } }
  ])
  const eventMap = new Map(eventAgg.map(e => [String(e._id).toLowerCase(), { count: e.count, lastLogin: e.lastLogin }]))

  // Aggregate file upload counts
  const userIds = users.map(u => u._id)
  const fileAgg = await FileModel.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $group: { _id: '$userId', filesUploaded: { $sum: 1 } } }
  ])
  const fileMap = new Map(fileAgg.map(f => [String(f._id), f.filesUploaded]))

  const items = users.map(u => ({
    id: String(u._id),
    name: u.name || '',
    email: u.email,
    role: u.role || 'user',
    status: u.status || 'active',
    lastLogin: u.lastLogin || eventMap.get(String(u.email).toLowerCase())?.lastLogin || null,
    created: u.createdAt,
    loginCount: typeof u.loginCount === 'number' ? u.loginCount : (eventMap.get(String(u.email).toLowerCase())?.count || 0),
    filesUploaded: fileMap.get(String(u._id)) || 0,
  }))

  return NextResponse.json({ users: items, total: items.length })
}

export async function POST(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { name, email, password, role = 'user', status = 'active' } = body
  if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Create user by delegating to auth helpers (hashing etc.) via direct model here
  try {
    const bcrypt = (await import('bcryptjs')).default
    const hash = await bcrypt.hash(password, 10)
    const doc = await UserModel.create({ name, email: String(email).toLowerCase().trim(), passwordHash: hash, role, status })
    return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 })
  } catch (e) {
    if (String(e?.message || '').includes('duplicate key')) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const { ids = [], action, role } = body
  if (!Array.isArray(ids) || ids.length === 0 || !action) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const filter = { _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) } }
  try {
    switch (action) {
      case 'activate':
        await UserModel.updateMany(filter, { $set: { status: 'active' } })
        break
      case 'deactivate':
        await UserModel.updateMany(filter, { $set: { status: 'inactive' } })
        break
      case 'suspend':
        await UserModel.updateMany(filter, { $set: { status: 'suspended' } })
        break
      case 'setRole':
        if (!role) return NextResponse.json({ error: 'Missing role' }, { status: 400 })
        await UserModel.updateMany(filter, { $set: { role } })
        break
      case 'delete':
        await UserModel.deleteMany(filter)
        break
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
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
  try {
    await UserModel.deleteOne({ _id: id })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
