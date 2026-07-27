import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const rateLimit = new Map<string, number>()
const RATE_LIMIT_MS = 60_000

function getIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown"
}

function isRateLimited(ip: string): boolean {
  const last = rateLimit.get(ip)
  if (last && Date.now() - last < RATE_LIMIT_MS) return true
  rateLimit.set(ip, Date.now())
  return false
}

export async function POST(request: Request) {
  const ip = getIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait a moment before sending another message." },
      { status: 429 }
    )
  }

  let body: { name?: string; email?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = (body.name || "").trim()
  const email = (body.email || "").trim()
  const message = (body.message || "").trim()

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from("messages").insert({
    name,
    email,
    message,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  return NextResponse.json(data || [])
}
