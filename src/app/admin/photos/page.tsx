"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { Upload, Shuffle } from "lucide-react"
import type { Photo } from "@/components/admin/types"
import { MAX_SELECTED, MAX_FEATURED } from "@/components/admin/types"
import PhotoGrid from "@/components/admin/PhotoGrid"
import UploadForm from "@/components/admin/UploadForm"
import EditModal from "@/components/admin/EditModal"

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const photosRef = useRef(photos)
  photosRef.current = photos

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

  const toggleSelected = useCallback(async (photo: Photo) => {
    const currentSelected = photosRef.current.filter((p) => p.selected).length
    if (!photo.selected && currentSelected >= MAX_SELECTED) {
      alert(`Maximum ${MAX_SELECTED} photos can be selected.`)
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
    }
  }, [])

  const toggleFeatured = useCallback(async (photo: Photo) => {
    const currentFeatured = photosRef.current.filter((p) => p.is_featured).length
    if (!photo.is_featured && currentFeatured >= MAX_FEATURED) {
      alert(`Maximum ${MAX_FEATURED} photos can be featured.`)
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
    }
  }, [])

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
    }
  }, [])

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
    }
  }, [fetchPhotos])

  const cancelEdit = useCallback(() => {
    setEditingPhoto(null)
  }, [])

  const handleDelete = useCallback(async (photo: Photo) => {
    if (!confirm(`Delete "${photo.title || photo.filename}"?`)) return

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))

    const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" })

    if (!res.ok) {
      setPhotos((prev) => [...prev, photo])
    }
  }, [])

  const handleUploadComplete = useCallback(async () => {
    await fetchPhotos()
  }, [fetchPhotos])

  const randomSelectPhotos = useCallback(async () => {
    const allPhotos = photosRef.current

    let targetIds: Set<string>
    if (allPhotos.length <= MAX_SELECTED) {
      targetIds = new Set(allPhotos.map((p) => p.id))
    } else {
      const shuffled = [...allPhotos].sort(() => Math.random() - 0.5)
      targetIds = new Set(shuffled.slice(0, MAX_SELECTED).map((p) => p.id))
    }

    const changed = allPhotos.filter((p) => p.selected !== targetIds.has(p.id))
    if (changed.length === 0) return

    setPhotos((prev) =>
      prev.map((p) => ({ ...p, selected: targetIds.has(p.id) }))
    )

    const results = await Promise.allSettled(
      changed.map((p) =>
        fetch(`/api/photos/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selected: targetIds.has(p.id) }),
        })
      )
    )

    const failed = results.some(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
    )
    if (failed) {
      await fetchPhotos()
    }
  }, [fetchPhotos])

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
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
        >
          <Upload size={16} />
          {showUpload ? "Cancel" : "Upload Photo"}
        </button>
      </div>

      {showUpload && <UploadForm onUploadComplete={handleUploadComplete} />}

      <PhotoGrid
        photos={photos}
        onToggleSelect={toggleSelected}
        onToggleFeatured={toggleFeatured}
        onSetHero={setHero}
        onEdit={startEdit}
        onDelete={handleDelete}
        onRandomSelect={randomSelectPhotos}
      />

      <EditModal
        photo={editingPhoto}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />
    </div>
  )
}
