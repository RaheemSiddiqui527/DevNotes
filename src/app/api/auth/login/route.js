export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { verifyUserPassword, issueJwt, setAuthCookie, createUser, findUserByEmail } from "@/lib/server/auth"
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

    if (seedEmail && email.toLowerCase().trim() === seedEmail) {
      if (!seedPass || password !== seedPass) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
      let adminUser = await findUserByEmail(email)
      if (!adminUser) {
        adminUser = await createUser({ name: "Admin", email, password: seedPass })
      }
      const token = await issueJwt({ id: adminUser.id || adminUser._id, email: email })
      const res = NextResponse.json({
        user: { id: adminUser.id || String(adminUser._id), name: adminUser.name || "Admin", email },
      })
      try {
        await EventModel.create({ type: "login", userId: adminUser.id || adminUser._id, userEmail: email, meta: {} })
      } catch (_) {}
      setAuthCookie(res.headers, token)
      return res
    }

    const user = await verifyUserPassword(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const token = await issueJwt(user)
    const res = NextResponse.json({ user })
    setAuthCookie(res.headers, token)
    try {
      await EventModel.create({ type: "login", userId: user.id, userEmail: user.email, meta: {} })
    } catch (_) {}
    return res
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
