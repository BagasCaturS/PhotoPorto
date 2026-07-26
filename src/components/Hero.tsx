"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const scrollY = window.scrollY
      const speed = 0.4
      el.style.transform = `translateY(${scrollY * speed}px)`
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-foreground dark:bg-dark-foreground">
      <div ref={ref} className="absolute inset-0 will-change-transform">
        <Image
          src="/photography/_DSF0088.webp"
          alt="Featured photography"
          fill
          className="object-cover opacity-60"
          preload
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-foreground dark:from-dark-foreground/60 dark:via-dark-foreground/30 dark:to-dark-foreground" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-on-primary/70 mb-6">
          Photography Portfolio
        </p>
        <h1 className="font-sans text-5xl font-bold leading-tight text-on-primary sm:text-7xl lg:text-8xl">
          Light. Shadow.
          <br />
          <span className="text-accent">Moment.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg font-mono text-base text-on-primary/60 sm:text-lg">
          A curated collection of visual stories captured through the lens.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#gallery"
            className="inline-flex h-12 items-center justify-center rounded-full bg-on-primary px-8 font-mono text-sm font-medium text-foreground transition-all duration-300 hover:bg-on-primary/90 hover:scale-105 cursor-pointer"
          >
            View Gallery
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-on-primary/30 px-8 font-mono text-sm font-medium text-on-primary transition-all duration-300 hover:border-on-primary/60 hover:scale-105 cursor-pointer"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
