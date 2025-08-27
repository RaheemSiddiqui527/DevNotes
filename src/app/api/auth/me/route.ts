export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/server/auth"

export async function GET(req) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ user: null }, { status: 200 })
  return NextResponse.json({ user }) // <-- must include user object
}

