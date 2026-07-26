"use client"

import { useEffect, useState, useRef } from "react"
import { Upload, Trash2, Check, X, Pencil, Save, Layers, Star } from "lucide-react"

interface Photo {
  id: string
  url: string
  filename: string
  selected: boolean
  display_order: number
  title: string
  description: string
  category: string
  is_hero: boolean
}

const MAX_SELECTED = 30
const CATEGORIES = ["Portrait", "Landscape", "Street", "Architecture", "Nature", "Detail"]

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadMode, setUploadMode] = useState<"single" | "batch">("single")
  const fileRef = useRef<HTMLInputElement>(null)
  const batchFileRef = useRef<HTMLInputElement>(null)

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [singlePreview, setSinglePreview] = useState<string | null>(null)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDesc, setUploadDesc] = useState("")
  const [uploadCat, setUploadCat] = useState(CATEGORIES[0])

  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchPreviews, setBatchPreviews] = useState<string[]>([])
  const [batchMeta, setBatchMeta] = useState<{ title: string; description: string; category: string }[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    return () => {
      if (singlePreview) URL.revokeObjectURL(singlePreview)
      batchPreviews.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editCat, setEditCat] = useState("")

  const fetchPhotos = async () => {
    const res = await fetch("/api/photos")
    const data = await res.json()
    setPhotos(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("title", uploadTitle)
    formData.append("description", uploadDesc)
    formData.append("category", uploadCat)

    await fetch("/api/photos", { method: "POST", body: formData })
    setUploading(false)
    setUploadFile(null)
    if (singlePreview) URL.revokeObjectURL(singlePreview)
    setSinglePreview(null)
    setUploadTitle("")
    setUploadDesc("")
    setUploadCat(CATEGORIES[0])
    if (fileRef.current) fileRef.current.value = ""
    setShowUpload(false)
    await fetchPhotos()
  }

  const handleSingleFileSelected = (file: File | null) => {
    if (singlePreview) URL.revokeObjectURL(singlePreview)
    setUploadFile(file)
    setSinglePreview(file ? URL.createObjectURL(file) : null)
  }

  const handleBatchFilesSelected = (files: FileList | null) => {
    batchPreviews.forEach((u) => URL.revokeObjectURL(u))
    const arr = Array.from(files || [])
    setBatchFiles(arr)
    setBatchPreviews(arr.map((f) => URL.createObjectURL(f)))
    setBatchMeta(
      arr.map((f) => ({
        title: f.name.replace(/\.[^.]+$/, ""),
        description: "",
        category: CATEGORIES[0],
      }))
    )
  }

  const updateBatchMeta = (index: number, field: "title" | "description" | "category", value: string) => {
    setBatchMeta((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (batchFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)
    let completed = 0

    for (let i = 0; i < batchFiles.length; i++) {
      const formData = new FormData()
      formData.append("file", batchFiles[i])
      formData.append("title", batchMeta[i]?.title || batchFiles[i].name.replace(/\.[^.]+$/, ""))
      formData.append("description", batchMeta[i]?.description || "")
      formData.append("category", batchMeta[i]?.category || CATEGORIES[0])

      await fetch("/api/photos", { method: "POST", body: formData })
      completed++
      setUploadProgress(Math.round((completed / batchFiles.length) * 100))
    }

    setUploading(false)
    setUploadProgress(0)
    setBatchFiles([])
    batchPreviews.forEach((u) => URL.revokeObjectURL(u))
    setBatchPreviews([])
    setBatchMeta([])
    if (batchFileRef.current) batchFileRef.current.value = ""
    setShowUpload(false)
    await fetchPhotos()
  }

  const toggleSelected = async (photo: Photo) => {
    const currentSelected = photos.filter((p) => p.selected).length
    if (!photo.selected && currentSelected >= MAX_SELECTED) {
      alert(`Maximum ${MAX_SELECTED} photos can be selected.`)
      return
    }

    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected: !photo.selected }),
    })
    await fetchPhotos()
  }

  const startEdit = (photo: Photo) => {
    setEditingId(photo.id)
    setEditTitle(photo.title || "")
    setEditDesc(photo.description || "")
    setEditCat(photo.category || CATEGORIES[0])
  }

  const saveEdit = async (id: string) => {
    await fetch(`/api/photos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDesc, category: editCat }),
    })
    setEditingId(null)
    await fetchPhotos()
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleDelete = async (photo: Photo) => {
    if (!confirm(`Delete "${photo.title || photo.filename}"?`)) return
    await fetch(`/api/photos/${photo.id}`, { method: "DELETE" })
    await fetchPhotos()
  }

  const selectedCount = photos.filter((p) => p.selected).length
  const heroPhoto = photos.find((p) => p.is_hero)

  const setHero = async (photo: Photo) => {
    const body: Record<string, boolean> = { is_hero: true }
    if (heroPhoto) {
      await fetch(`/api/photos/${heroPhoto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hero: false }),
      })
    }
    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    await fetchPhotos()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold">Photo Management</h2>
          <p className="mt-1 font-mono text-sm text-secondary dark:text-dark-secondary">
            {selectedCount} / {MAX_SELECTED} selected — only selected photos appear on the gallery
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
        >
          <Upload size={16} />
          {showUpload ? "Cancel" : "Upload Photo"}
        </button>
      </div>

      {showUpload && (
        <div className="mb-8 rounded-xl border border-border dark:border-dark-border">
          <div className="flex border-b border-border dark:border-dark-border">
            <button
              onClick={() => setUploadMode("single")}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-3 font-mono text-sm transition-colors ${
                uploadMode === "single"
                  ? "border-b-2 border-foreground font-semibold text-foreground dark:border-dark-foreground dark:text-dark-foreground"
                  : "text-secondary hover:text-foreground dark:text-dark-secondary dark:hover:text-dark-foreground"
              }`}
            >
              <Upload size={14} />
              Single Upload
            </button>
            <button
              onClick={() => setUploadMode("batch")}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-3 font-mono text-sm transition-colors ${
                uploadMode === "batch"
                  ? "border-b-2 border-foreground font-semibold text-foreground dark:border-dark-foreground dark:text-dark-foreground"
                  : "text-secondary hover:text-foreground dark:text-dark-secondary dark:hover:text-dark-foreground"
              }`}
            >
              <Layers size={14} />
              Batch Upload
            </button>
          </div>

          {uploadMode === "single" ? (
            <form onSubmit={handleUpload} className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">File</label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleSingleFileSelected(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-sm file:text-background dark:border-dark-border dark:file:bg-dark-foreground dark:file:text-dark-background"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Category</label>
                  <select
                    value={uploadCat}
                    onChange={(e) => setUploadCat(e.target.value)}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Title</label>
                  <input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Photo title"
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Description</label>
                  <input
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    placeholder="A brief description..."
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
                  />
                </div>
              </div>

              {singlePreview && (
                <div className="mt-4">
                  <p className="mb-2 font-mono text-xs text-secondary dark:text-dark-secondary">Preview</p>
                  <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-muted dark:bg-dark-muted">
                    <img
                      src={singlePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !uploadFile}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
              >
                <Upload size={14} />
                {uploading ? "Uploading..." : "Upload to Gallery"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleBatchUpload} className="p-6">
              <div className="mb-4">
                <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Select multiple images</label>
                <input
                  ref={batchFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  onChange={(e) => handleBatchFilesSelected(e.target.files)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-sm file:text-background dark:border-dark-border dark:file:bg-dark-foreground dark:file:text-dark-background"
                />
              </div>

              {batchFiles.length > 0 && (
                <div className="mb-4 overflow-x-auto rounded-lg border border-border dark:border-dark-border">
                  <table className="w-full text-left font-mono text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-secondary dark:border-dark-border dark:text-dark-secondary">
                        <th className="px-3 py-2 font-medium">Preview</th>
                        <th className="px-3 py-2 font-medium">File</th>
                        <th className="px-3 py-2 font-medium">Title</th>
                        <th className="px-3 py-2 font-medium">Description</th>
                        <th className="px-3 py-2 font-medium">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchFiles.map((f, i) => (
                        <tr key={i} className="border-b border-border last:border-b-0 dark:border-dark-border">
                          <td className="px-3 py-2">
                            <div className="aspect-[4/3] w-16 overflow-hidden rounded-md bg-muted dark:bg-dark-muted">
                              <img
                                src={batchPreviews[i]}
                                alt={f.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="max-w-[120px] truncate px-3 py-2 text-foreground/70 dark:text-dark-foreground/70">
                            {f.name}
                          </td>
                          <td className="px-3 py-1">
                            <input
                              value={batchMeta[i]?.title || ""}
                              onChange={(e) => updateBatchMeta(i, "title", e.target.value)}
                              placeholder="Title"
                              className="w-full min-w-[120px] rounded border border-border bg-transparent px-2 py-1 text-sm dark:border-dark-border"
                            />
                          </td>
                          <td className="px-3 py-1">
                            <input
                              value={batchMeta[i]?.description || ""}
                              onChange={(e) => updateBatchMeta(i, "description", e.target.value)}
                              placeholder="Description"
                              className="w-full min-w-[160px] rounded border border-border bg-transparent px-2 py-1 text-sm dark:border-dark-border"
                            />
                          </td>
                          <td className="px-3 py-1">
                            <select
                              value={batchMeta[i]?.category || CATEGORIES[0]}
                              onChange={(e) => updateBatchMeta(i, "category", e.target.value)}
                              className="w-full min-w-[120px] rounded border border-border bg-transparent px-2 py-1 text-sm dark:border-dark-border"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {uploading && (
                <div className="mb-4">
                  <div className="mb-1 flex justify-between font-mono text-xs text-secondary dark:text-dark-secondary">
                    <span>Uploading... {uploadProgress}%</span>
                    <span>{Math.round(batchFiles.length * (uploadProgress / 100))} of {batchFiles.length}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted dark:bg-dark-muted">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || batchFiles.length === 0}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
              >
                <Layers size={14} />
                {uploading ? "Uploading..." : `Upload All ${batchFiles.length} Files`}
              </button>
            </form>
          )}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-mono text-base text-secondary dark:text-dark-secondary">
            No photos yet. Upload your first photo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                photo.selected
                  ? "border-accent"
                  : "border-transparent hover:border-border"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted dark:bg-dark-muted">
                <img
                  src={photo.url}
                  alt={photo.title || photo.filename}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1 p-2">
                <p className="truncate font-sans text-sm font-semibold">
                  {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
                </p>
                <p className="truncate font-mono text-xs text-secondary dark:text-dark-secondary">
                  {photo.category || "Uncategorized"}
                </p>
              </div>

              <div className="absolute inset-0 flex items-start justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => toggleSelected(photo)}
                  className={`cursor-pointer rounded-full p-1.5 transition-colors ${
                    photo.selected
                      ? "bg-accent text-white"
                      : "bg-black/50 text-white hover:bg-black/70"
                  }`}
                  title={photo.selected ? "Deselect" : "Select"}
                >
                  {photo.selected ? <X size={14} /> : <Check size={14} />}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => setHero(photo)}
                    className={`cursor-pointer rounded-full p-1.5 transition-colors ${
                      photo.is_hero
                        ? "bg-amber-500 text-white"
                        : "bg-black/50 text-white hover:bg-amber-500"
                    }`}
                    title={photo.is_hero ? "Current hero" : "Set as hero background"}
                  >
                    <Star size={14} />
                  </button>
                  <button
                    onClick={() => startEdit(photo)}
                    className="cursor-pointer rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-accent"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(photo)}
                    className="cursor-pointer rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-destructive"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 flex gap-1.5">
                {photo.selected && (
                  <div className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-white">
                    Selected
                  </div>
                )}
                {photo.is_hero && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 font-mono text-xs text-white">
                    <Star size={10} />
                    Hero
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={cancelEdit}>
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-background p-6 dark:border-dark-border dark:bg-dark-background"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-sans text-lg font-semibold">Edit Photo</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 font-mono text-sm dark:border-dark-border"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-secondary dark:text-dark-secondary">Category</label>
                <select
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
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
                onClick={cancelEdit}
                className="cursor-pointer rounded-full border border-border px-5 py-2 font-mono text-sm transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => editingId && saveEdit(editingId)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
              >
                <Save size={14} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
