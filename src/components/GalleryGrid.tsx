"use client"

import { useState, useCallback, useRef } from "react"
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "motion/react"
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
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40)
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`

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
    <motion.section
      id="gallery"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-24 sm:py-32 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 dark:bg-orange-600/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
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
              <div className="relative overflow-hidden rounded-xl bg-muted/80 dark:bg-dark-muted/80 backdrop-blur-sm">
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

const GridPattern = ({
  offsetX,
  offsetY,
}: {
  offsetX: ReturnType<typeof useMotionValue<number>>
  offsetY: ReturnType<typeof useMotionValue<number>>
}) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="gallery-grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gallery-grid-pattern)" />
    </svg>
  )
}
