import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'

// MongoDB + Auth utilities for API route handlers
// Dependencies required: mongoose, bcryptjs, jose

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-please-change'
const JWT_ISSUER = process.env.JWT_ISSUER || 'devnotes-app'
const AUTH_COOKIE = process.env.AUTH_COOKIE || 'auth_token'

let connPromise = null
export async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return

  if (connPromise) {
    try {
      await connPromise
      if (mongoose.connection.readyState === 1) return
    } catch (_) {
      connPromise = null
    }
  }

  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB
  mongoose.set('strictQuery', true)
  connPromise = mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 20000,
  })

  try {
    await connPromise
  } catch (err) {
    connPromise = null
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Mongo] connection error:', err?.message || err)
      console.error('[Mongo] MONGODB_URI:', uri)
      console.error('[Mongo] MONGODB_DB:', dbName)
    }
    throw err
  }
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'users' })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

function toSafeUser(doc) {
  if (!doc) return null
  const o = doc._doc ? doc.toObject() : doc
  return {
    id: String(o._id),
    name: o.name,
    email: o.email,
    createdAt: o.createdAt,
  }
}

// Users
export async function findUserByEmail(email) {
  await ensureConnected()
  return User.findOne({ email: (email || '').toLowerCase().trim() }).lean()
}

export async function findUserById(id) {
  await ensureConnected()
  const found = await User.findById(id).lean()
  return toSafeUser(found)
}

export async function createUser({ name, email, password }) {
  await ensureConnected()
  const existing = await User.findOne({ email: (email || '').toLowerCase().trim() }).lean()
  if (existing) {
    const err = new Error('Email already registered')
    err.code = 'EMAIL_TAKEN'
    throw err
  }
  const hash = await bcrypt.hash(password, 10)
  const doc = await User.create({ name, email: (email || '').toLowerCase().trim(), passwordHash: hash })
  return toSafeUser(doc)
}

export async function verifyUserPassword(email, password) {
  await ensureConnected()
  const user = await User.findOne({ email: (email || '').toLowerCase().trim() }).lean()
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return null
  return toSafeUser(user)
}

// JWT
function getKey() {
  return new TextEncoder().encode(JWT_SECRET)
}

export async function issueJwt(user) {
  const key = getKey()
  const token = await new jose.SignJWT({ sub: String(user.id), email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(JWT_ISSUER)
    .setAudience('web')
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
  return token
}

export async function verifyJwt(token) {
  try {
    const { payload } = await jose.jwtVerify(token, getKey(), {
      issuer: JWT_ISSUER,
      audience: 'web',
    })
    return payload
  } catch (_) {
    return null
  }
}

// Cookies
export function setAuthCookie(headers, token) {
  const secure = process.env.NODE_ENV === 'production'
  headers.append('Set-Cookie', `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}; ${secure ? 'Secure' : ''}`)
}

export function clearAuthCookie(headers) {
  const secure = process.env.NODE_ENV === 'production'
  headers.append('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; ${secure ? 'Secure' : ''}`)
}

export function getTokenFromRequest(req) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(`${AUTH_COOKIE}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export async function getUserFromRequest(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  const payload = await verifyJwt(token)
  if (!payload?.sub) return null
  return findUserById(payload.sub)
}
