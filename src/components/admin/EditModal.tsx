import { useState, useEffect } from "react"
import { Save, X } from "lucide-react"
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onCancel()
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl dark:border-dark-border dark:bg-dark-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-dark-border">
          <h3 className="font-sans text-lg font-semibold">Edit photo</h3>
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-muted hover:text-foreground dark:text-dark-secondary dark:hover:bg-dark-muted dark:hover:text-dark-foreground"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Photo title"
              className="w-full rounded-lg border border-border bg-transparent px-3.5 py-2.5 font-mono text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A brief description..."
              className="w-full resize-none rounded-lg border border-border bg-transparent px-3.5 py-2.5 font-mono text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-3.5 py-2.5 font-mono text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 dark:border-dark-border">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-5 py-2 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
