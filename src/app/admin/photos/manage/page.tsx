"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { ArrowLeft, Star, Heart, Image as ImageIcon, X, Check, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Photo } from "@/components/admin/types"
import { MAX_SELECTED, MAX_FEATURED } from "@/components/admin/types"
import { getThumbUrl } from "@/lib/utils"

type Toast = { message: string; type: "success" | "error" } | null
type PickerMode = "hero" | "featured" | "gallery" | null

function PhotoThumb({ photo, selected, onClick }: { photo: Photo; selected?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
        selected
          ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]"
          : "border-border/50 hover:border-border dark:border-dark-border/50 dark:hover:border-dark-border"
      }`}
    >
      <img
        src={getThumbUrl(photo.url)}
        alt={photo.title || photo.filename}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
        selected
          ? "bg-accent/10 opacity-100"
          : "bg-black/0 opacity-0 group-hover:bg-black/20 group-hover:opacity-100"
      }`}>
        {selected && <Check size={24} className="text-accent drop-shadow-md" />}
        {!selected && <Plus size={24} className="text-white drop-shadow-md" />}
      </div>
    </button>
  )
}

export default function ManageAssignments() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [pickerMode, setPickerMode] = useState<PickerMode>(null)
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
  const featuredPhotos = useMemo(() => photos.filter((p) => p.is_featured), [photos])
  const galleryPhotos = useMemo(() => photos.filter((p) => p.selected), [photos])

  const availableForHero = useMemo(
    () => photos.filter((p) => !p.is_hero),
    [photos]
  )
  const availableForFeatured = useMemo(
    () => photos.filter((p) => !p.is_featured),
    [photos]
  )
  const availableForGallery = useMemo(
    () => photos.filter((p) => !p.selected),
    [photos]
  )

  const pickerPhotos = useMemo(() => {
    if (!pickerMode) return []
    switch (pickerMode) {
      case "hero": return availableForHero
      case "featured": return availableForFeatured
      case "gallery": return availableForGallery
    }
  }, [pickerMode, availableForHero, availableForFeatured, availableForGallery])

  const assignHero = useCallback(async (photo: Photo) => {
    const previousHero = photosRef.current.find((p) => p.is_hero)

    setPhotos((prev) =>
      prev.map((p) => ({ ...p, is_hero: p.id === photo.id }))
    )
    setPickerMode(null)

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
      await fetchPhotos()
      showToast("Failed to assign hero.", "error")
    } else {
      showToast("Hero photo updated.")
    }
  }, [fetchPhotos, showToast])

  const removeHero = useCallback(async () => {
    const current = photosRef.current.find((p) => p.is_hero)
    if (!current) return

    setPhotos((prev) =>
      prev.map((p) => (p.id === current.id ? { ...p, is_hero: false } : p))
    )

    const res = await fetch(`/api/photos/${current.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_hero: false }),
    })

    if (!res.ok) {
      await fetchPhotos()
      showToast("Failed to remove hero.", "error")
    } else {
      showToast("Hero photo removed.")
    }
  }, [fetchPhotos, showToast])

  const toggleFeatured = useCallback(async (photo: Photo, assign: boolean) => {
    if (assign && featuredPhotos.length >= MAX_FEATURED) {
      showToast(`Maximum ${MAX_FEATURED} photos can be featured.`, "error")
      return
    }

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id ? { ...p, is_featured: assign } : p
      )
    )
    setPickerMode(null)

    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: assign }),
    })

    if (!res.ok) {
      await fetchPhotos()
      showToast("Failed to update featured.", "error")
    } else {
      showToast(assign ? "Added to featured." : "Removed from featured.")
    }
  }, [featuredPhotos.length, fetchPhotos, showToast])

  const toggleGallery = useCallback(async (photo: Photo, assign: boolean) => {
    if (assign && galleryPhotos.length >= MAX_SELECTED) {
      showToast(`Maximum ${MAX_SELECTED} photos in gallery.`, "error")
      return
    }

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photo.id ? { ...p, selected: assign } : p
      )
    )
    setPickerMode(null)

    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected: assign }),
    })

    if (!res.ok) {
      await fetchPhotos()
      showToast("Failed to update gallery.", "error")
    } else {
      showToast(assign ? "Added to gallery." : "Removed from gallery.")
    }
  }, [galleryPhotos.length, fetchPhotos, showToast])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/photos")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-border hover:text-foreground dark:border-dark-border/60 dark:text-dark-secondary dark:hover:border-dark-border dark:hover:text-dark-foreground"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div>
          <h2 className="font-sans text-2xl font-bold">Assign Photos</h2>
          <p className="mt-1 font-mono text-xs text-secondary dark:text-dark-secondary">
            Manage hero, featured, and gallery photos
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Hero Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star size={16} className="text-amber-500" />
              <h3 className="font-sans text-lg font-semibold">Hero Background</h3>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                1 max
              </span>
            </div>
            {heroPhoto ? (
              <button
                onClick={removeHero}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-destructive hover:text-destructive dark:border-dark-border/60 dark:text-dark-secondary"
              >
                <X size={13} />
                Remove
              </button>
            ) : null}
          </div>

          {heroPhoto ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-muted dark:bg-dark-muted">
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-video sm:w-1/2 lg:aspect-[16/9]">
                  <img
                    src={getThumbUrl(heroPhoto.url)}
                    alt={heroPhoto.title || "Hero photo"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                    <Star size={11} />
                    Current Hero
                  </span>
                  <p className="font-sans text-lg font-bold">{heroPhoto.title || heroPhoto.filename.replace(/\.[^.]+$/, "")}</p>
                  <p className="mt-1 font-mono text-xs text-secondary dark:text-dark-secondary">{heroPhoto.category}</p>
                  <button
                    onClick={() => setPickerMode("hero")}
                    className="mt-4 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 font-mono text-sm text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
                  >
                    <Plus size={14} />
                    Change Hero
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 dark:border-dark-border">
              <Star size={32} className="mb-3 text-secondary/40 dark:text-dark-secondary/40" />
              <p className="font-mono text-sm text-secondary dark:text-dark-secondary">No hero photo assigned</p>
              <p className="mt-1 font-mono text-xs text-secondary/60 dark:text-dark-secondary/60">
                Choose a photo for the hero background
              </p>
              <button
                onClick={() => setPickerMode("hero")}
                className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-5 py-2.5 font-mono text-sm text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
              >
                <Plus size={15} />
                Assign Hero Photo
              </button>
            </div>
          )}
        </section>

        {/* Featured Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={16} className="text-rose-500" />
              <h3 className="font-sans text-lg font-semibold">Featured Photos</h3>
              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-400">
                {featuredPhotos.length} / {MAX_FEATURED}
              </span>
            </div>
            {featuredPhotos.length < MAX_FEATURED && (
              <button
                onClick={() => setPickerMode("featured")}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border/60 dark:text-dark-secondary"
              >
                <Plus size={13} />
                Add
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredPhotos.map((photo) => (
              <div key={photo.id} className="group relative">
                <PhotoThumb
                  photo={photo}
                  onClick={() => toggleFeatured(photo, false)}
                  selected
                />
                <div className="mt-1.5 truncate px-0.5 text-center font-mono text-[11px] text-secondary dark:text-dark-secondary">
                  {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
                </div>
              </div>
            ))}
            {featuredPhotos.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 dark:border-dark-border">
                <Heart size={24} className="mb-2 text-secondary/40 dark:text-dark-secondary/40" />
                <p className="font-mono text-xs text-secondary dark:text-dark-secondary">No featured photos</p>
              </div>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon size={16} className="text-accent" />
              <h3 className="font-sans text-lg font-semibold">Gallery Selection</h3>
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent">
                {galleryPhotos.length} / {MAX_SELECTED}
              </span>
            </div>
            {galleryPhotos.length < MAX_SELECTED && (
              <button
                onClick={() => setPickerMode("gallery")}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border/60 dark:text-dark-secondary"
              >
                <Plus size={13} />
                Add
              </button>
            )}
          </div>

          {galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="group relative">
                  <PhotoThumb
                    photo={photo}
                    onClick={() => toggleGallery(photo, false)}
                    selected
                  />
                  <div className="mt-1.5 truncate px-0.5 text-center font-mono text-[11px] text-secondary dark:text-dark-secondary">
                    {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 dark:border-dark-border">
              <ImageIcon size={24} className="mb-2 text-secondary/40 dark:text-dark-secondary/40" />
              <p className="font-mono text-xs text-secondary dark:text-dark-secondary">
                No photos selected for the gallery
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-secondary/60 dark:text-dark-secondary/60">
                Select up to {MAX_SELECTED} photos to display
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Photo Picker Modal */}
      {pickerMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setPickerMode(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl dark:border-dark-border dark:bg-dark-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-dark-border">
              <h3 className="font-sans text-lg font-semibold">
                {pickerMode === "hero" && "Choose Hero Photo"}
                {pickerMode === "featured" && "Add Featured Photo"}
                {pickerMode === "gallery" && "Add to Gallery"}
              </h3>
              <button
                onClick={() => setPickerMode(null)}
                className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-muted hover:text-foreground dark:text-dark-secondary dark:hover:bg-dark-muted dark:hover:text-dark-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {pickerPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {pickerPhotos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <PhotoThumb
                        photo={photo}
                        onClick={() => {
                          if (pickerMode === "hero") assignHero(photo)
                          else if (pickerMode === "featured") toggleFeatured(photo, true)
                          else if (pickerMode === "gallery") toggleGallery(photo, true)
                        }}
                      />
                      <div className="mt-1.5 truncate px-0.5 text-center font-mono text-[11px] text-secondary dark:text-dark-secondary">
                        {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="font-mono text-sm text-secondary dark:text-dark-secondary">
                    {pickerMode === "hero" && "All photos are already assigned as hero"}
                    {pickerMode === "featured" && "No more photos available to feature"}
                    {pickerMode === "gallery" && "All photos are already in the gallery"}
                  </p>
                  <p className="mt-1 font-mono text-xs text-secondary/60 dark:text-dark-secondary/60">
                    Upload new photos first
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
