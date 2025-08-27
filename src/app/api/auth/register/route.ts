export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { createUser, issueJwt, setAuthCookie } from "../../../../lib/server/auth.js"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    const seedEmail = (process.env.ADMIN_SEED_EMAIL || "").toLowerCase().trim()
    const seedPass = process.env.ADMIN_SEED_PASSWORD || ""
    if (seedEmail && email.toLowerCase().trim() === seedEmail) {
      if (!seedPass || password !== seedPass) {
        return NextResponse.json({ error: "This email is reserved for admin." }, { status: 400 })
      }
    }

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    const user = await createUser({ name, email, password })
    const token = await issueJwt(user)
    const res = NextResponse.json({ user }, { status: 201 })
    setAuthCookie(res.headers, token)
    return res
  } catch (e) {
    if (e.code === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
