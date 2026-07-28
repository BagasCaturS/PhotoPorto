"use client"

import { useState, useCallback } from "react"
import { motion } from "motion/react"
import type { Photo } from "@/data/photos"
import Lightbox from "./Lightbox"
import ProtectedImage from "./ProtectedImage"

interface GalleryGridProps {
  photos: Photo[]
  categories: string[]
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const headingUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const filterUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

const cardUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function GalleryGrid({ photos, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered =
    activeCategory === "All"
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase())

  const getGlobalIndex = useCallback(
    (localIndex: number) => {
      const photo = filtered[localIndex]
      return photos.findIndex((p) => p.id === photo.id)
    },
    [filtered, photos]
  )

  return (
    <motion.section
      id="gallery"
      className="py-24 sm:py-32"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div className="mb-16 text-center" variants={headingUp}>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Collection
          </p>
          <h2 className="font-sans text-4xl font-bold sm:text-5xl">
            Featured Work
          </h2>
        </motion.div>

        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-2"
          variants={headingUp}
        >
          {["All", ...categories].map((cat) => (
            <motion.button
              key={cat}
              variants={filterUp}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer rounded-full px-5 py-2 font-mono text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-foreground text-background dark:bg-dark-foreground dark:text-dark-background"
                  : "bg-muted text-secondary dark:bg-dark-muted dark:text-dark-secondary hover:bg-border dark:hover:bg-dark-border"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="columns-1 gap-6 sm:columns-2 lg:columns-3"
          variants={headingUp}
        >
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.id}
              variants={cardUp}
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
            </motion.div>
          ))}
        </motion.div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </motion.section>
  )
}
