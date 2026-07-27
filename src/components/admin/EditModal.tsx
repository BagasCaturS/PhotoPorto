import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { CATEGORIES } from "./types"
import type { Photo } from "./types"

interface Props {
  photo: Photo | null
  onSave: (id: string, title: string, description: string, category: string) => Promise<void>
  onCancel: () => void
}

export default function EditModal({ photo, onSave, onCancel }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (photo) {
      setTitle(photo.title || "")
      setDescription(photo.description || "")
      setCategory(photo.category || CATEGORIES[0])
    }
  }, [photo])

  if (!photo) return null

  const handleSave = async () => {
    setSaving(true)
    await onSave(photo.id, title, description, category)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 dark:border-dark-border dark:bg-dark-background"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 font-sans text-lg font-semibold">Edit Photo</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-border px-5 py-2 font-mono text-sm transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}
