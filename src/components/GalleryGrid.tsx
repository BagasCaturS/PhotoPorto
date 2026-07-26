"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import type { Photo } from "@/data/photos"
import Lightbox from "./Lightbox"

interface GalleryGridProps {
  photos: Photo[]
  categories: string[]
}

export default function GalleryGrid({ photos, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered =
    activeCategory === "All"
      ? photos
      : photos.filter((p) => p.category === activeCategory)

  const getGlobalIndex = useCallback(
    (localIndex: number) => {
      const photo = filtered[localIndex]
      return photos.findIndex((p) => p.id === photo.id)
    },
    [filtered, photos]
  )

  return (
    <section id="gallery" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Collection
          </p>
          <h2 className="font-sans text-4xl font-bold sm:text-5xl">
            Featured Work
          </h2>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer rounded-full px-5 py-2 font-mono text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-foreground text-background dark:bg-dark-foreground dark:text-dark-background"
                  : "bg-muted text-secondary dark:bg-dark-muted dark:text-dark-secondary hover:bg-border dark:hover:bg-dark-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {filtered.map((photo, i) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(getGlobalIndex(i))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setLightboxIndex(getGlobalIndex(i))
                }
              }}
              role="button"
              tabIndex={0}
              className="group mb-6 block break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted dark:bg-dark-muted">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  className="h-auto w-full object-cover transition-all duration-700 group-hover:scale-105"
                  preload={i < 3}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/80 p-6 text-center opacity-0 transition-opacity duration-400 group-hover:opacity-100 dark:bg-black/80">
                  <h3 className="font-sans text-xl font-bold text-white">
                    {photo.title}
                  </h3>
                  <p className="font-mono text-sm font-medium tracking-wide uppercase text-white/80">
                    {photo.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  )
}
