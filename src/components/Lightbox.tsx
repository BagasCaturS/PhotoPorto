"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { Photo } from "@/data/photos"

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[currentIndex]

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onNavigate(currentIndex - 1)
      if (e.key === "ArrowRight" && currentIndex < photos.length - 1)
        onNavigate(currentIndex + 1)
    },
    [currentIndex, photos.length, onClose, onNavigate]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [handleKey])

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 cursor-pointer rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex - 1)
          }}
          className="absolute left-4 z-10 cursor-pointer rounded-full p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Previous photo"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      <div
        className="flex max-h-[90vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.title}
          width={photo.width}
          height={photo.height}
          className="max-h-[82vh] w-auto rounded-lg object-contain"
          preload
          sizes="90vw"
        />
      </div>

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex + 1)
          }}
          className="absolute right-4 z-10 cursor-pointer rounded-full p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Next photo"
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div
        className="absolute bottom-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-sans text-lg font-semibold text-white">
          {photo.title}
        </p>
        <p className="font-mono text-sm tracking-wide uppercase text-white/60">
          {photo.category} — {currentIndex + 1} of {photos.length}
        </p>
      </div>
    </div>
  )
}
