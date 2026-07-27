"use client"

import { useEffect, useRef } from "react"
import ProtectedImage from "./ProtectedImage"

interface Props {
  heroSrc?: string | null
}

export default function Hero({ heroSrc }: Props) {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = parallaxRef.current
    if (!el) return
    const onScroll = () => {
      const scrollY = window.scrollY
      el.style.transform = `translateY(${scrollY * 0.4}px)`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-foreground dark:bg-dark-foreground">
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {heroSrc ? (
          <ProtectedImage
            src={heroSrc}
            alt="Featured photography"
            fill
            className="object-cover"
            preload
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-5"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            Photography Portfolio
          </p>
          <h1
            className="font-sans text-5xl font-bold leading-[0.95] tracking-tight text-on-primary sm:text-7xl lg:text-8xl xl:text-9xl"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3)" }}
          >
            Light.
            <br />
            Shadow.
            <br />
            <span className="text-accent">Moment.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-lg font-mono text-base leading-relaxed text-on-primary/50"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
          >
            A curated collection of visual stories captured through the lens.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#gallery"
              className="inline-flex h-12 items-center justify-center rounded-full bg-on-primary px-8 font-mono text-sm font-medium text-foreground transition-all duration-300 hover:bg-on-primary/90"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            >
              View Gallery
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-on-primary/20 px-8 font-mono text-sm font-medium text-on-primary/70 transition-all duration-300 hover:border-on-primary/50 hover:text-on-primary"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
        <div className="h-10 w-px bg-on-primary/20" />
      </div>
    </section>
  )
}
