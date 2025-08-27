export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { clearAuthCookie } from "../../../../lib/server/auth.js"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  clearAuthCookie(res.headers)
  return res
}
