import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "../../../../lib/mongodb.js"
import { createUser, logEvent } from "../../../../lib/server/auth.js"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup API called")

    const { name, email, password } = await request.json()
    console.log("[v0] Signup data received:", { name, email, passwordLength: password?.length })

    if (!name || !email || !password) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Connecting to database...")
    await connectDB()
    console.log("[v0] Database connected successfully")

    console.log("[v0] Creating user...")
    const result = await createUser({ name, email, password })
    console.log("[v0] User creation result:", result)

    if (!result.success) {
      console.log("[v0] User creation failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    console.log("[v0] Logging signup event...")
    await logEvent({
      type: "user_signup",
      userId: result.user._id,
      email: result.user.email,
      metadata: { name: result.user.name },
    })

    console.log("[v0] Signup successful")
    const response = NextResponse.json({
      success: true,
      user: {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        isAdmin: result.user.isAdmin,
      },
    })

    // Set auth cookie
    response.cookies.set(process.env.AUTH_COOKIE || "auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
