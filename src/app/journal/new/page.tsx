"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { createClient } from "@/lib/supabase/client"
import { createJournal } from "@/lib/journal-api"
import { compressImage } from "@/lib/compress-image"
import { Upload, X } from "lucide-react"
import RichTextEditor from "@/components/RichTextEditor"

export default function NewJournalPage() {
  const router = useRouter()
  const { isAdmin, isLoading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/auth/login?redirect=/journal/new")
    }
  }, [isAdmin, isLoading, router])

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview)
    }
  }, [coverPreview])

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const removeCover = () => {
    setCoverFile(null)
    setCoverPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const uploadCover = async (): Promise<string> => {
    if (!coverFile) return ""
    const compressed = await compressImage(coverFile)
    const supabase = createClient()
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    const { error: uploadErr } = await supabase.storage
      .from("photos")
      .upload(path, compressed, { contentType: "image/webp", upsert: true })
    if (uploadErr) throw new Error(uploadErr.message)
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path)
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSaving(true)
    setError(null)
    setUploading(true)
    try {
      let coverUrl = ""
      if (coverFile) {
        coverUrl = await uploadCover()
      }
      const entry = await createJournal({
        title: title.trim(),
        excerpt: excerpt.trim() || title.trim(),
        content,
        coverSrc: coverUrl,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: !asDraft,
      })
      router.push(asDraft ? "/admin" : `/journal/${entry.slug}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create")
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  if (isLoading || !isAdmin) return null

  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">Write</p>
              <h1 className="font-sans text-4xl font-bold sm:text-5xl">New Journal Entry</h1>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* ---- FORM ---- */}
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
                <div>
                  <label htmlFor="title" className="block font-mono text-sm font-medium mb-2">Title *</label>
                  <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                    className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
                    placeholder="Entry title..." />
                </div>

                <div>
                  <label htmlFor="excerpt" className="block font-mono text-sm font-medium mb-2">Excerpt</label>
                  <input id="excerpt" type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
                    placeholder="Short summary" />
                </div>

                <div>
                  <label htmlFor="content" className="block font-mono text-sm font-medium mb-2">Content *</label>
                  <RichTextEditor content={content} onChange={setContent} placeholder="Write your journal entry here..." />
                </div>

                <div>
                  <label htmlFor="tags" className="block font-mono text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
                    placeholder="e.g. Portrait, Technique, City" />
                </div>

                <div>
                  <p className="block font-mono text-sm font-medium mb-3">Cover Image</p>
                  {coverPreview ? (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted dark:bg-dark-muted">
                      <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                      <button type="button" onClick={removeCover}
                        className="absolute top-3 right-3 cursor-pointer rounded-full bg-foreground/70 p-1.5 text-background transition-colors hover:bg-foreground">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border px-6 py-12 font-mono text-sm text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border dark:text-dark-secondary dark:hover:border-dark-accent">
                      <Upload size={20} />
                      Click to upload cover image
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                </div>

                {error && <p className="font-mono text-sm text-destructive">{error}</p>}

                <div className="flex items-center gap-4 pt-4">
                  <button type="submit" disabled={saving || !title.trim() || !content.trim()}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background">
                    {saving ? "Publishing..." : "Publish Entry"}
                  </button>
                  <button type="button" onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)} disabled={saving || !title.trim() || !content.trim()}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-border px-8 font-mono text-sm font-medium text-secondary transition-all duration-300 hover:bg-muted disabled:opacity-50 dark:border-dark-border dark:text-dark-secondary dark:hover:bg-dark-muted">
                    {saving ? "Saving..." : "Save as Draft"}
                  </button>
                  <button type="button" onClick={() => router.push("/journal")}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-border px-8 font-mono text-sm font-medium text-secondary/50 transition-all duration-300 hover:bg-muted dark:border-dark-border dark:text-dark-secondary/50 dark:hover:bg-dark-muted">
                    Cancel
                  </button>
                </div>
              </form>

              {/* ---- PREVIEW ---- */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="mb-6 text-center font-mono text-xs tracking-[0.2em] uppercase text-accent">Preview</p>
                {!title && !coverPreview && !content ? (
                  <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border py-32 dark:border-dark-border">
                    <p className="font-mono text-sm text-secondary dark:text-dark-secondary">Start typing to see preview</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-border dark:border-dark-border">
                    <div className="relative h-[40vh] min-h-[260px] overflow-hidden bg-foreground dark:bg-dark-foreground">
                      {coverPreview ? (
                        <img src={coverPreview} alt="" className="h-full w-full object-cover opacity-60" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-neutral-700 to-neutral-900" />
                      )}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                        <div className="mx-auto max-w-3xl px-6 text-center">
                          {tagList.length > 0 && (
                            <div className="mb-4 flex flex-wrap justify-center gap-2">
                              {tagList.map((t) => (
                                <span key={t} className="rounded-full bg-on-primary/20 px-3 py-1 font-mono text-xs text-on-primary">{t}</span>
                              ))}
                            </div>
                          )}
                          <h1 className="font-sans text-3xl font-bold text-on-primary sm:text-4xl">
                            {title || "Untitled Entry"}
                          </h1>
                          {excerpt && (
                            <p className="mt-3 font-mono text-sm text-on-primary/60">{excerpt}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-10">
                      {content ? (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none font-mono text-base leading-relaxed text-secondary dark:text-dark-secondary [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ) : (
                        <p className="font-mono text-sm text-secondary/50 dark:text-dark-secondary/50 italic">
                          No content yet
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}