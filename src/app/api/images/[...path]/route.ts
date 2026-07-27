import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params

  if (pathSegments.length === 0) {
    return new NextResponse("Bad Request", { status: 400 })
  }

  if (pathSegments[0] === "storage") {
    return serveFromSupabase(pathSegments.slice(1).join("/"))
  }

  if (pathSegments[0] === "fallback") {
    return serveFromLocal(pathSegments.slice(1).join("/"))
  }

  return new NextResponse("Bad Request", { status: 400 })
}

async function serveFromSupabase(storagePath: string): Promise<NextResponse> {
  const supabase = await createClient()

  const { data } = await supabase.storage
    .from("photos")
    .createSignedUrl(storagePath, 60)

  if (!data?.signedUrl) {
    const { data: pub } = supabase.storage.from("photos").getPublicUrl(storagePath)
    if (!pub?.publicUrl) {
      return new NextResponse("Not Found", { status: 404 })
    }
    return fetchAndRespond(pub.publicUrl)
  }

  return fetchAndRespond(data.signedUrl)
}

async function serveFromLocal(localPath: string): Promise<NextResponse> {
  const fullPath = path.join(process.cwd(), "public", "photography", localPath)

  try {
    const buffer = await fs.readFile(fullPath)
    const ext = path.extname(fullPath).toLowerCase()
    const contentType =
      ext === ".png" ? "image/png"
      : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
      : ext === ".gif" ? "image/gif"
      : "image/webp"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new NextResponse("Not Found", { status: 404 })
  }
}

async function fetchAndRespond(sourceUrl: string): Promise<NextResponse> {
  try {
    const response = await fetch(sourceUrl)
    if (!response.ok) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const blob = await response.blob()

    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/webp",
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new NextResponse("Not Found", { status: 404 })
  }
}
