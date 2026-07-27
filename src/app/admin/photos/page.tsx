"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { Upload, LayoutList, Shuffle } from "lucide-react"
import Link from "next/link"
import type { Photo } from "@/components/admin/types"
import { MAX_SELECTED, MAX_FEATURED } from "@/components/admin/types"
import PhotoGrid from "@/components/admin/PhotoGrid"
import EditModal from "@/components/admin/EditModal"

type Toast = { message: string; type: "success" | "error" } | null

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const photosRef = useRef(photos)
  photosRef.current = photos

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const fetchPhotos = useCallback(async () => {
    const res = await fetch("/api/photos")
    const data = await res.json()
    setPhotos(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const heroPhoto = useMemo(() => photos.find((p) => p.is_hero), [photos])
  const totalCount = photos.length

  const toggleSelected = useCallback(async (photo: Photo) => {
    const currentSelected = photosRef.current.filter((p) => p.selected).length
    if (!photo.selected && currentSelected >= MAX_SELECTED) {
      showToast(`Maximum ${MAX_SELECTED} photos can be selected.`, "error")
      return
    }

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id ? { ...p, selected: !p.selected } : p
      )
    )

    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected: !photo.selected }),
    })

    if (!res.ok) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, selected: photo.selected } : p
        )
      )
      showToast("Failed to update selection.", "error")
    }
  }, [showToast])

  const toggleFeatured = useCallback(async (photo: Photo) => {
    const currentFeatured = photosRef.current.filter((p) => p.is_featured).length
    if (!photo.is_featured && currentFeatured >= MAX_FEATURED) {
      showToast(`Maximum ${MAX_FEATURED} photos can be featured.`, "error")
      return
    }

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id ? { ...p, is_featured: !p.is_featured } : p
      )
    )

    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !photo.is_featured }),
    })

    if (!res.ok) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, is_featured: photo.is_featured } : p
        )
      )
      showToast("Failed to update featured.", "error")
    }
  }, [showToast])

  const setHero = useCallback(async (photo: Photo) => {
    const previousHero = photosRef.current.find((p) => p.is_hero)

    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        is_hero: p.id === photo.id,
      }))
    )

    if (previousHero && previousHero.id !== photo.id) {
      await fetch(`/api/photos/${previousHero.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hero: false }),
      })
    }

    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_hero: true }),
    })

    if (!res.ok) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === previousHero?.id ? { ...p, is_hero: true } :
          p.id === photo.id ? { ...p, is_hero: false } : p
        )
      )
      showToast("Failed to update hero.", "error")
    } else {
      showToast("Hero photo updated.")
    }
  }, [showToast])

  const startEdit = useCallback((photo: Photo) => {
    setEditingPhoto(photo)
  }, [])

  const saveEdit = useCallback(async (id: string, title: string, description: string, category: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, title, description, category } : p
      )
    )
    setEditingPhoto(null)

    const res = await fetch(`/api/photos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
    })

    if (!res.ok) {
      await fetchPhotos()
      showToast("Failed to save changes.", "error")
    } else {
      showToast("Photo updated.")
    }
  }, [fetchPhotos, showToast])

  const cancelEdit = useCallback(() => {
    setEditingPhoto(null)
  }, [])

  const handleDelete = useCallback(async (photo: Photo) => {
    const deleted = photo

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    showToast("Photo deleted.")

    const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" })

    if (!res.ok) {
      setPhotos((prev) => [...prev, deleted])
      showToast("Failed to delete.", "error")
    }
  }, [showToast])

  const randomAll = useCallback(async () => {
    const allPhotos = photosRef.current
    if (allPhotos.length === 0) return

    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5)

    const selectedTargets = new Set(
      shuffled.slice(0, Math.min(MAX_SELECTED, allPhotos.length)).map((p) => p.id)
    )
    const featuredTargets = new Set(
      shuffled.slice(0, Math.min(MAX_FEATURED, allPhotos.length)).map((p) => p.id)
    )
    const heroTarget = allPhotos[Math.floor(Math.random() * allPhotos.length)]

    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        selected: selectedTargets.has(p.id),
        is_featured: featuredTargets.has(p.id),
        is_hero: p.id === heroTarget.id,
      }))
    )

    const changes = allPhotos.map((p) =>
      fetch(`/api/photos/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected: selectedTargets.has(p.id),
          is_featured: featuredTargets.has(p.id),
          is_hero: p.id === heroTarget.id,
        }),
      })
    )
    const results = await Promise.allSettled(changes)
    const failed = results.some(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
    )
    if (failed) {
      await fetchPhotos()
      showToast("Random assignment failed.", "error")
    } else {
      showToast("Gallery, featured & hero randomly assigned.")
    }
  }, [fetchPhotos, showToast])

  const clearSelection = useCallback(async () => {
    const selected = photosRef.current.filter((p) => p.selected)
    if (selected.length === 0) return

    setPhotos((prev) => prev.map((p) => ({ ...p, selected: false })))

    const results = await Promise.allSettled(
      selected.map((p) =>
        fetch(`/api/photos/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selected: false }),
        })
      )
    )

    const failed = results.some(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
    )
    if (failed) {
      await fetchPhotos()
      showToast("Failed to clear selection.", "error")
    } else {
      showToast("Selection cleared.")
    }
  }, [fetchPhotos, showToast])

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold">Photos</h2>
          <p className="mt-1 font-mono text-xs text-secondary dark:text-dark-secondary">
            {totalCount} photo{totalCount !== 1 ? "s" : ""} in library ·{" "}
            {photos.filter((p) => p.selected).length} selected ·{" "}
            {photos.filter((p) => p.is_featured).length} featured
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/photos/manage"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-2.5 font-mono text-sm font-medium text-secondary transition-all hover:border-border hover:text-foreground dark:border-dark-border/60 dark:text-dark-secondary dark:hover:border-dark-border dark:hover:text-dark-foreground"
          >
            <LayoutList size={15} />
            Assign
          </Link>
          <Link
            href="/admin/photos/upload"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
          >
            <Upload size={15} />
            Upload
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={randomAll}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-4 py-2 font-mono text-xs text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border/60 dark:text-dark-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent"
        >
          <Shuffle size={14} />
          Acak Semua
        </button>
      </div>

      <PhotoGrid
        photos={photos}
        loading={loading}
        onToggleSelect={toggleSelected}
        onToggleFeatured={toggleFeatured}
        onSetHero={setHero}
        onEdit={startEdit}
        onDelete={handleDelete}
        onClearSelection={clearSelection}
      />

      <EditModal
        photo={editingPhoto}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border px-5 py-2.5 font-mono text-sm shadow-lg backdrop-blur-md transition-all duration-300 ${
            toast.type === "error"
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border/60 bg-background/80 text-foreground dark:border-dark-border/60 dark:bg-dark-background/80 dark:text-dark-foreground"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
