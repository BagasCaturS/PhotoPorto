"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ProgressSlider,
  SliderContent,
  SliderWrapper,
  SliderBtnGroup,
  SliderBtn,
} from "@/components/ui/progressive-carousel"

interface FeaturedPhoto {
  id: string
  url: string
  title: string
  description: string
}

interface Props {
  photos: FeaturedPhoto[]
}

export default function FeaturedSection({ photos }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (photos.length === 0) return null

  return (
    <section
      id="featured"
      ref={ref}
      className={`border-t border-border py-24 sm:py-32 dark:border-dark-border transition-all duration-1000 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Featured Work
          </p>
          <h2 className="font-sans text-3xl font-bold sm:text-4xl">
            Selected Frames
          </h2>
        </div>

        <ProgressSlider vertical={false} activeSlider={photos[0].id}>
          <SliderContent>
            {photos.map((photo) => (
              <SliderWrapper key={photo.id} value={photo.id}>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted dark:bg-dark-muted">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 1200px"
                  />
                </div>
              </SliderWrapper>
            ))}
          </SliderContent>

          <SliderBtnGroup className="mt-6 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
            {photos.map((photo) => (
              <SliderBtn
                key={photo.id}
                value={photo.id}
                className="relative cursor-pointer overflow-hidden rounded-xl border border-border p-4 text-left transition-colors hover:border-accent dark:border-dark-border dark:hover:border-dark-accent"
                progressBarClass="absolute bottom-0 left-0 h-0.5 bg-accent"
              >
                <h3 className="font-sans text-sm font-semibold leading-tight">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="mt-1 line-clamp-2 font-mono text-xs text-secondary dark:text-dark-secondary">
                    {photo.description}
                  </p>
                )}
              </SliderBtn>
            ))}
          </SliderBtnGroup>
        </ProgressSlider>
      </div>
    </section>
  )
}
