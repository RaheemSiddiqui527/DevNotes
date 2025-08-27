import { connectDB } from "../mongodb.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ISSUER = process.env.JWT_ISSUER
const AUTH_COOKIE = process.env.AUTH_COOKIE

export async function createUser({ name, email, password }) {
  const db = await connectDB()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    const error = new Error("Email already registered")
    error.code = "EMAIL_TAKEN"
    throw error
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  })

  return {
    id: result.insertedId.toString(),
    name,
    email,
  }
}

export async function findUserByEmail(email) {
  const db = await connectDB()
  const user = await db.collection("users").findOne({ email })
  if (!user) return null

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
  }
}

export async function verifyUserPassword(email, password) {
  const user = await findUserByEmail(email)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export async function issueJwt(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { issuer: JWT_ISSUER, expiresIn: "7d" })
}

export function setAuthCookie(headers, token) {
  headers.set("Set-Cookie", `${AUTH_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`)
}

export function clearAuthCookie(headers) {
  headers.set("Set-Cookie", `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`)
}

export async function getUserFromRequest(req) {
  const cookieStore = cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value

  if (!token) return null

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await findUserByEmail(payload.email)
    return user ? { id: user.id, name: user.name, email: user.email } : null
  } catch {
    return null
  }
}
