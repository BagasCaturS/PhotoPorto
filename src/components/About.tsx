"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

export default function About() {
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
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={ref}
      className="border-t border-border py-24 sm:py-32 dark:border-dark-border"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div
            className={`relative aspect-[4/5] overflow-hidden rounded-2xl transition-all duration-1000 ${
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <Image
              src="/photography/_DSF0109.webp"
              alt="Photographer portrait"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div
            className={`transition-all duration-1000 delay-200 ${
              visible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
              About
            </p>
            <h2 className="font-sans text-4xl font-bold sm:text-5xl">
              The Vision
            </h2>
            <div className="mt-8 space-y-5 font-mono text-base leading-relaxed text-secondary dark:text-dark-secondary">
              <p>
                Every photograph is a conversation between light and shadow, a
                fragment of time frozen in a frame. I seek the extraordinary in
                the ordinary — the way morning light falls on concrete, the
                geometry of urban spaces, the quiet poetry of a passing moment.
              </p>
              <p>
                My work explores the tension between permanence and transience,
                capturing the fleeting beauty that exists at the intersection of
                chance and intention. Each image is an invitation to pause, to
                look closer, and to find meaning in the spaces we usually
                overlook.
              </p>
              <p>
                Based in Bandung, I work across portrait, landscape, and street
                photography — always searching for the frame that tells a story
                without words.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
