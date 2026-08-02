"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { compressImage } from "@/lib/compress-image"

export default function AdminAbout() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => setCurrentUrl(d?.url || null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatus(null)
  }

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setSaving(true)
    setStatus(null)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append("file", compressed)
      const res = await fetch("/api/about", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok || data.error) {
        setStatus({ message: data.error || "Failed to update portrait.", type: "error" })
      } else {
        setCurrentUrl(data.url)
        setFile(null)
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        setStatus({ message: "Portrait updated.", type: "success" })
      }
    } catch {
      setStatus({ message: "Failed to update portrait.", type: "error" })
    } finally {
      setSaving(false)
    }
  }, [file])

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-border hover:text-foreground dark:border-dark-border/60 dark:text-dark-secondary dark:hover:border-dark-border dark:hover:text-dark-foreground"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div>
          <h2 className="font-sans text-2xl font-bold">About Portrait</h2>
          <p className="mt-1 font-mono text-xs text-secondary dark:text-dark-secondary">
            Change the photographer portrait shown in the about section
          </p>
        </div>
      </div>

      <div className="max-w-lg">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
              Current Portrait
            </p>
            <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-muted dark:border-dark-border dark:bg-dark-muted">
              {currentUrl ? (
                <img
                  src={currentUrl}
                  alt="Current portrait"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-secondary/50 dark:text-dark-secondary/50">
                  <ArrowLeft size={20} className="rotate-135" />
                  <p className="font-mono text-xs">No portrait uploaded — using default</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
              New Portrait
            </p>
            {preview ? (
              <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-accent bg-muted dark:bg-dark-muted">
                <img
                  src={preview}
                  alt="New portrait preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  className="absolute right-2 top-2 cursor-pointer rounded-full bg-foreground/70 p-1.5 text-background transition-colors hover:bg-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border px-6 py-12 font-mono text-sm text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border dark:text-dark-secondary dark:hover:border-dark-accent"
              >
                <Upload size={20} />
                Click to choose portrait image
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelect}
              className="hidden"
            />
          </div>

          {status && (
            <p
              className={`font-mono text-sm ${
                status.type === "error" ? "text-destructive" : "text-accent"
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !file}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-8 py-3 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
            >
              <Upload size={16} />
              {saving ? "Saving..." : "Save Portrait"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              disabled={!file}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-8 py-3 font-mono text-sm font-medium text-secondary transition-colors hover:bg-muted disabled:opacity-40 dark:border-dark-border dark:text-dark-secondary dark:hover:bg-dark-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}