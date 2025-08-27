export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import {
  verifyUserPassword,
  issueJwt,
  setAuthCookie,
  createUser,
  findUserByEmail,
} from "../../../../lib/server/auth.js"
import mongoose from "mongoose"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const seedEmail = (process.env.ADMIN_SEED_EMAIL || "").toLowerCase().trim()
    const seedPass = process.env.ADMIN_SEED_PASSWORD || ""

    const EventSchema = new mongoose.Schema(
      {
        type: String,
        userId: mongoose.Schema.Types.ObjectId,
        userEmail: String,
        meta: Object,
        createdAt: { type: Date, default: Date.now },
      },
      { collection: "events" },
    )
    const EventModel = mongoose.models.Event || mongoose.model("Event", EventSchema)

    // Admin login
    if (seedEmail && email.toLowerCase().trim() === seedEmail) {
      if (!seedPass || password !== seedPass) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      let adminUser = await findUserByEmail(email)
      if (!adminUser) {
        // Create admin user with fixed email and password
        adminUser = await createUser({ name: "Admin", email, password: seedPass })
      }

      const token = await issueJwt({ id: adminUser.id || adminUser._id, email: adminUser.email })

      /** @type {{ id: string; name: string; email: string }} */
      const safeUser = {
        id: adminUser.id || String(adminUser._id), // Fixed admin ID
        name: adminUser.name || "Admin",
        email: adminUser.email,
      }

      const res = NextResponse.json({ user: safeUser })

      try {
        const eventDoc = new EventModel({
          type: "login",
          userId: adminUser.id || adminUser._id,
          userEmail: email,
          meta: {},
        })
        await eventDoc.save()
      } catch (_) {}

      setAuthCookie(res.headers, token)
      return res
    }

    // Regular user login
    const user = await verifyUserPassword(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await issueJwt(user)

    /** @type {{ id: string; name: string; email: string }} */
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const res = NextResponse.json({ user: safeUser })

    setAuthCookie(res.headers, token)

    try {
      const eventDoc = new EventModel({
        type: "login",
        userId: user.id,
        userEmail: user.email,
        meta: {},
      })
      await eventDoc.save()
    } catch (_) {}

    return res
  } catch (e) {
    console.error("Login error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
