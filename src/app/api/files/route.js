import { NextResponse } from 'next/server'
import { ensureConnected, getUserFromRequest } from '@/lib/server/auth'
import mongoose from 'mongoose'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAdmin(user) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return !!(user?.email && list.includes(String(user.email).toLowerCase()))
}

// Mongoose model (defined here to avoid extra files in this step)
const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String },
  size: { type: Number },
  relPath: { type: String, required: true }, // path relative to project root
  folder: { type: String }, // optional logical folder label (e.g., admin batch)
  createdAt: { type: Date, default: Date.now, index: true },
}, { collection: 'files' })

const FileModel = mongoose.models.UserFile || mongoose.model('UserFile', FileSchema)

function uploadsRoot() {
  return path.join(process.cwd(), 'uploads')
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

// GET /api/files
// - Without id: list files for the current user
// - With id: stream file (inline by default, attachment if download=1)
export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const download = url.searchParams.get('download') === '1'
  const scope = url.searchParams.get('scope')
  const userId = (user._id || user.id)
  const admin = isAdmin(user)

  if (!id) {
    if (scope === 'all' && !admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const query = scope === 'all' ? {} : { userId }
    const docs = await FileModel.find(query).sort({ createdAt: -1 }).lean()
    const files = docs.map(d => ({
      id: String(d._id),
      name: d.name,
      type: d.type,
      size: d.size,
      createdAt: d.createdAt,
      folder: d.folder || null,
      mine: String(d.userId) === String(userId),
    }))
    return NextResponse.json({ files })
  }

  const doc = await FileModel.findOne({ _id: id }).lean()
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const absPath = path.join(process.cwd(), doc.relPath)
  try {
    const data = await fs.readFile(absPath)
    const headers = new Headers()
    headers.set('Content-Type', doc.type || 'application/octet-stream')
    headers.set('Content-Length', String(doc.size || data.length))
    headers.set('Cache-Control', 'private, max-age=0, must-revalidate')
    const disposition = download ? 'attachment' : 'inline'
    headers.set('Content-Disposition', `${disposition}; filename="${encodeURIComponent(doc.name)}"`)
    return new NextResponse(data, { status: 200, headers })
  } catch (e) {
    return NextResponse.json({ error: 'File missing on server' }, { status: 410 })
  }
}

// POST /api/files (multipart/form-data) -> upload file(s)
export async function POST(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()

  const form = await req.formData()
  const files = form.getAll('file')
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided (form field name "file")' }, { status: 400 })
  }

  const root = uploadsRoot()
  const baseUserFolder = path.join(root, String(user._id || user.id))
  await ensureDir(baseUserFolder)

  // If admin, create a new batch subfolder for this upload
  const admin = isAdmin(user)
  const batchFolder = admin ? `admin-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}` : null
  const targetFolder = batchFolder ? path.join(baseUserFolder, batchFolder) : baseUserFolder
  await ensureDir(targetFolder)

  const saved = []
  const events = []
  for (const f of files) {
    // f is a File object in the web Fetch API sense
    const origName = sanitizeFileName(f.name || 'upload')
    const ts = Date.now()
    const uniqueName = `${ts}_${Math.random().toString(36).slice(2, 8)}_${origName}`
    const abs = path.join(targetFolder, uniqueName)
    const relPath = path.relative(process.cwd(), abs)

    const buf = Buffer.from(await f.arrayBuffer())
    await fs.writeFile(abs, buf)

    const doc = await FileModel.create({
      userId: user._id || user.id,
      name: origName,
      type: f.type || 'application/octet-stream',
      size: f.size || buf.length,
      relPath,
      folder: batchFolder,
    })
    saved.push({ id: String(doc._id), name: doc.name })
  }

  // Log upload event (best-effort)
  try {
    const mongooseMod = await import('mongoose')
    const mongoose2 = mongooseMod.default
    const EventSchema = new mongoose2.Schema({ type: String, userId: mongoose2.Schema.Types.ObjectId, userEmail: String, meta: Object, createdAt: { type: Date, default: Date.now } }, { collection: 'events' })
    const EventModel = mongoose2.models.Event || mongoose2.model('Event', EventSchema)
    await EventModel.create({ type: 'upload', userId: user._id || user.id, userEmail: user.email, meta: { count: saved.length, folder: batchFolder } })
  } catch (_) {}

  return NextResponse.json({ ok: true, saved, folder: batchFolder }, { status: 201 })
}

// DELETE /api/files?id=<id>
export async function DELETE(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureConnected()
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const doc = await FileModel.findOne({ _id: id, userId: user._id || user.id }).lean()
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const absPath = path.join(process.cwd(), doc.relPath)
  try {
    await fs.unlink(absPath)
  } catch (_) {
    // ignore missing file
  }
  await FileModel.deleteOne({ _id: id, userId: user._id || user.id })
  return NextResponse.json({ ok: true })
}
