import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    isAdmin = profile?.role === "admin"
  }

  let query = supabase.from("journals").select("*").eq("slug", id)

  if (!isAdmin) {
    query = query.eq("published", true)
  }

  const { data } = await query.single()

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

  const body = await request.json()
  const newCover = body.coverSrc || body.cover_src

  const { data: existing } = await supabase
    .from("journals")
    .select("cover_src")
    .eq("slug", id)
    .single()

  const oldCover = existing?.cover_src
  if (oldCover && newCover && oldCover !== newCover) {
    const storagePath = oldCover.split("/photos/").pop()
    if (storagePath) {
      await supabase.storage.from("photos").remove([storagePath])
    }
  }

  const updateData: Record<string, unknown> = {
    title: body.title,
    excerpt: body.excerpt,
    content: typeof body.content === "string" ? [body.content] : body.content,
    cover_src: newCover,
    tags: body.tags,
    updated_at: new Date().toISOString(),
  }
  if (body.published !== undefined) {
    updateData.published = body.published
  }
  const { error } = await supabase
    .from("journals")
    .update(updateData)
    .eq("slug", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

  const { data: journal } = await supabase
    .from("journals")
    .select("cover_src")
    .eq("slug", id)
    .single()

  if (journal?.cover_src) {
    const coverUrl = journal.cover_src
    const storagePath = coverUrl.split("/photos/").pop()
    if (storagePath) {
      await supabase.storage.from("photos").remove([storagePath])
    }
  }

  const { error } = await supabase
    .from("journals")
    .delete()
    .eq("slug", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
