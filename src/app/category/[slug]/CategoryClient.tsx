"use client"

import { useState } from "react"
import type { Photo } from "@/data/photos"
import Lightbox from "@/components/Lightbox"
import ProtectedImage from "@/components/ProtectedImage"

interface Props {
  photos: Photo[]
}

export default function CategoryClient({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setLightboxIndex(i)
              }
            }}
            role="button"
            tabIndex={0}
            className="group mb-6 block break-inside-avoid overflow-hidden rounded-xl cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl bg-muted dark:bg-dark-muted">
              <ProtectedImage
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

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  )
}
