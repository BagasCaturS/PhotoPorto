import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("photos")
    .select("*")
    .order("display_order", { ascending: true })

  return NextResponse.json(data || [])
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

  const title = (formData.get("title") as string) || ""
  const description = (formData.get("description") as string) || ""
  const category = (formData.get("category") as string) || ""

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`
  const filePath = `gallery/${filename}`

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(filePath)

  const { count } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true })

  const { data, error } = await supabase
    .from("photos")
    .insert({
      storage_path: filePath,
      url: publicUrl,
      filename: file.name,
      selected: false,
      display_order: (count || 0) + 1,
      title,
      description,
      category,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
