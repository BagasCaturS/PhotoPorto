import { useState, useRef, useCallback } from "react"
import { Upload, Layers, X, FileImage, Trash2 } from "lucide-react"
import { CATEGORIES } from "./types"
import { compressImage } from "@/lib/compress-image"

interface Props {
  onUploadComplete: () => Promise<void>
}

export default function UploadForm({ onUploadComplete }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const batchFileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"single" | "batch">("single")

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [singlePreview, setSinglePreview] = useState<string | null>(null)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDesc, setUploadDesc] = useState("")
  const [uploadCat, setUploadCat] = useState(CATEGORIES[0])

  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchPreviews, setBatchPreviews] = useState<string[]>([])
  const [batchMeta, setBatchMeta] = useState<{ title: string; description: string; category: string }[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleSingleFileSelected = useCallback((file: File | null) => {
    if (singlePreview) URL.revokeObjectURL(singlePreview)
    setUploadFile(file)
    setSinglePreview(file ? URL.createObjectURL(file) : null)
  }, [singlePreview])

  const handleBatchFilesSelected = useCallback((files: FileList | null) => {
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
  }, [batchPreviews])

  const updateBatchMeta = useCallback((index: number, field: "title" | "description" | "category", value: string) => {
    setBatchMeta((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }, [])

  const removeBatchFile = useCallback((index: number) => {
    URL.revokeObjectURL(batchPreviews[index])
    setBatchFiles((prev) => prev.filter((_, i) => i !== index))
    setBatchPreviews((prev) => prev.filter((_, i) => i !== index))
    setBatchMeta((prev) => prev.filter((_, i) => i !== index))
  }, [batchPreviews])

  const handleSingleUpload = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    setUploading(true)
    const compressed = await compressImage(uploadFile)
    const formData = new FormData()
    formData.append("file", compressed)
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
    await onUploadComplete()
  }, [uploadFile, uploadTitle, uploadDesc, uploadCat, singlePreview, onUploadComplete])

  const handleBatchUpload = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (batchFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)
    let completed = 0

    const CHUNK_SIZE = 5
    for (let i = 0; i < batchFiles.length; i += CHUNK_SIZE) {
      const chunk = batchFiles.slice(i, i + CHUNK_SIZE)
      const uploads = chunk.map(async (file, j) => {
        const idx = i + j
        const compressed = await compressImage(file)
        const formData = new FormData()
        formData.append("file", compressed)
        formData.append("title", batchMeta[idx]?.title || file.name.replace(/\.[^.]+$/, ""))
        formData.append("description", batchMeta[idx]?.description || "")
        formData.append("category", batchMeta[idx]?.category || CATEGORIES[0])
        return fetch("/api/photos", { method: "POST", body: formData })
      })
      await Promise.all(uploads)
      completed += chunk.length
      setUploadProgress(Math.round((completed / batchFiles.length) * 100))
    }

    setUploading(false)
    setUploadProgress(0)
    setBatchFiles([])
    batchPreviews.forEach((u) => URL.revokeObjectURL(u))
    setBatchPreviews([])
    setBatchMeta([])
    if (batchFileRef.current) batchFileRef.current.value = ""
    await onUploadComplete()
  }, [batchFiles, batchMeta, batchPreviews, onUploadComplete])

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border dark:border-dark-border">
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
          Single
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
          Batch
        </button>
      </div>

      {uploadMode === "single" ? (
        <form onSubmit={handleSingleUpload} className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
                File
              </label>
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border dark:text-dark-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                  <FileImage size={16} />
                  <span className="font-mono">Choose image</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => handleSingleFileSelected(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </label>
                {uploadFile && (
                  <span className="font-mono text-xs text-secondary dark:text-dark-secondary">
                    {uploadFile.name}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
                Title
              </label>
              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Photo title"
                className="w-full rounded-lg border border-border bg-transparent px-3.5 py-2.5 font-mono text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
                Category
              </label>
              <select
                value={uploadCat}
                onChange={(e) => setUploadCat(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-3.5 py-2.5 font-mono text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
                Description
              </label>
              <input
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="A brief description..."
                className="w-full rounded-lg border border-border bg-transparent px-3.5 py-2.5 font-mono text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
              />
            </div>
          </div>

          {singlePreview && (
            <div>
              <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
                Preview
              </p>
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
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
          >
            <Upload size={14} />
            {uploading ? "Uploading..." : "Upload to gallery"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleBatchUpload} className="p-6">
          <div className="mb-5">
            <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-secondary dark:text-dark-secondary">
              Select multiple images
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border dark:text-dark-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
              <Layers size={16} />
              <span className="font-mono">Choose files</span>
              <input
                ref={batchFileRef}
                type="file"
                accept="image/*"
                multiple
                required
                onChange={(e) => handleBatchFilesSelected(e.target.files)}
                className="sr-only"
              />
            </label>
            {batchFiles.length > 0 && (
              <p className="mt-1.5 font-mono text-xs text-secondary dark:text-dark-secondary">
                {batchFiles.length} file{batchFiles.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {batchFiles.length > 0 && (
            <div className="mb-5 overflow-x-auto rounded-lg border border-border dark:border-dark-border">
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] text-secondary dark:border-dark-border dark:text-dark-secondary">
                    <th className="px-3 py-2.5 font-medium">Preview</th>
                    <th className="px-3 py-2.5 font-medium">Title</th>
                    <th className="px-3 py-2.5 font-medium">Description</th>
                    <th className="px-3 py-2.5 font-medium">Category</th>
                    <th className="w-12 px-3 py-2.5 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {batchFiles.map((f, i) => (
                    <tr key={f.name + f.lastModified} className="border-b border-border last:border-b-0 dark:border-dark-border">
                      <td className="px-3 py-2">
                        <div className="aspect-[4/3] w-14 overflow-hidden rounded-md bg-muted dark:bg-dark-muted">
                          <img
                            src={batchPreviews[i]}
                            alt={f.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={batchMeta[i]?.title || ""}
                          onChange={(e) => updateBatchMeta(i, "title", e.target.value)}
                          placeholder="Title"
                          className="w-full min-w-[120px] rounded border border-border bg-transparent px-2 py-1 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={batchMeta[i]?.description || ""}
                          onChange={(e) => updateBatchMeta(i, "description", e.target.value)}
                          placeholder="Description"
                          className="w-full min-w-[140px] rounded border border-border bg-transparent px-2 py-1 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={batchMeta[i]?.category || CATEGORIES[0]}
                          onChange={(e) => updateBatchMeta(i, "category", e.target.value)}
                          className="w-full min-w-[120px] rounded border border-border bg-transparent px-2 py-1 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent dark:focus:ring-dark-accent"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeBatchFile(i)}
                          className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive dark:text-dark-secondary dark:hover:text-destructive"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {uploading && (
            <div className="mb-5">
              <div className="mb-2 flex justify-between font-mono text-xs text-secondary dark:text-dark-secondary">
                <span>Uploading... {uploadProgress}%</span>
                <span>{Math.round(batchFiles.length * (uploadProgress / 100))} of {batchFiles.length}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted dark:bg-dark-muted">
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
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
          >
            <Layers size={14} />
            {uploading ? "Uploading..." : `Upload all ${batchFiles.length} files`}
          </button>
        </form>
      )}
    </div>
  )
}
