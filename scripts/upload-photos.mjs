import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join, extname } from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

config({ path: join(__dirname, "..", ".env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing env vars. Make sure .env.local has:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=<your-url>\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>\n" +
      "\nGet your service_role key at: Supabase Dashboard → Project Settings → API"
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const PHOTOS_DIR = join(__dirname, "..", "public", "photography")
const BUCKET = "photos"

const categories = [
  "Portrait", "Landscape", "Street", "Architecture", "Nature", "Detail",
]

const titles = [
  "Silent Contemplation", "Urban Solitude", "Golden Hour",
  "Shadows & Light", "Midnight Reverie", "City Frames",
  "Ethereal Glow", "Concrete Jungle", "Serenity",
  "Parallel Lines", "The Wait", "Morning Haze",
  "Reflections", "Crossing Paths", "Still Life",
  "The Observer", "Depth of Field", "Monochrome Dreams",
  "Temporal Shift", "Natural Geometry", "Passing Through",
  "Fragments", "Horizon Line", "In Between",
  "First Light", "Contrast", "Last Frame",
]

async function uploadAll() {
  const files = readdirSync(PHOTOS_DIR)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(extname(f)))
    .sort()

  console.log(`Found ${files.length} files to upload.`)

  // Clear existing photos
  const { error: delError } = await supabase.from("photos").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  if (delError) console.warn("Clear photos warning:", delError.message)

  // Remove existing storage files
  const { data: existing } = await supabase.storage.from(BUCKET).list("gallery")
  if (existing?.length) {
    const paths = existing.map((f) => `gallery/${f.name}`)
    await supabase.storage.from(BUCKET).remove(paths)
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = join(PHOTOS_DIR, file)
    const buffer = readFileSync(filePath)
    const storagePath = `gallery/${Date.now()}-${file.replace(/[^a-zA-Z0-9._-]/g, "_")}`

    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${file}... `)

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadErr) {
      console.log("FAILED:", uploadErr.message)
      continue
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)

    const { error: insertErr } = await supabase.from("photos").insert({
      storage_path: storagePath,
      url: urlData.publicUrl,
      filename: file,
      selected: true,
      display_order: i + 1,
      width: 2400,
      height: i % 3 === 0 ? 3600 : 2400,
    })

    if (insertErr) {
      console.log("INSERT FAILED:", insertErr.message)
    } else {
      console.log("OK")
    }
  }

  console.log("\nDone! Check /admin/photos to verify.")
}

uploadAll().catch(console.error)
