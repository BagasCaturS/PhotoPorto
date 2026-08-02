import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PORTRAIT_FOLDER = "gallery"
const PORTRAIT_NAME = "about-portrait.webp"
const PORTRAIT_PATH = `${PORTRAIT_FOLDER}/${PORTRAIT_NAME}`

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("photos")
    .list(PORTRAIT_FOLDER, { limit: 100, search: "about-portrait" })

  if (error || !data?.length) {
    return NextResponse.json({ url: null })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(PORTRAIT_PATH)

  return NextResponse.json({ url: publicUrl })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(PORTRAIT_PATH, buffer, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(PORTRAIT_PATH)

  return NextResponse.json({ url: publicUrl })
}