"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { GlowCard } from "@/components/ui/spotlight-card"
import { Camera, Eye, Feather } from "lucide-react"

const DEFAULT_PORTRAIT = "/photography/_DSF0109.webp"

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [portraitSrc, setPortraitSrc] = useState(DEFAULT_PORTRAIT)

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => {
        if (d?.url) setPortraitSrc(d.url)
      })
      .catch(() => {})
  }, [])

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

  return (
    <section id="about" ref={ref}>
      <div className="border-t border-border py-24 sm:py-32 dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted transition-all duration-1000 dark:bg-dark-muted ${
                visible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <Image
                src={portraitSrc}
                alt="Photographer portrait"
                fill
                className="object-contain"
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
                The Story Behind<br />the Lens
              </h2>
              <div className="mt-8 space-y-5 font-mono text-base leading-relaxed text-secondary dark:text-dark-secondary">
                <p className="text-lg text-foreground dark:text-dark-foreground">
                  I&apos;m a photographer based in Bandung, capturing moments
                  that tell stories without words. My work spans portrait,
                  landscape, and street photography — always searching for the
                  frame that reveals something true about the world.
                </p>
                <p>
                  Every photograph is a conversation between light and shadow, a
                  fragment of time frozen in a frame. I seek the extraordinary
                  in the ordinary — the way morning light falls on concrete, the
                  geometry of urban spaces, the quiet poetry of a passing
                  moment.
                </p>
                <p>
                  My approach is rooted in patience and observation. I believe
                  that the best images are not created but discovered — they
                  exist already in the world, waiting for someone to notice
                  them. My role is simply to be present, to see clearly, and to
                  frame what I find with honesty and intention.
                </p>
                <p>
                  I work exclusively with natural light, preferring the
                  authenticity it brings to an image. Whether it&apos;s the warm
                  glow of golden hour or the dramatic shadows of midday, natural
                  light offers an honesty that artificial lighting often masks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pb-24 sm:pb-32 dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4 mt-4">
              Philosophy
            </p>
            <h2 className="font-sans text-3xl font-bold sm:text-4xl">
              Approach &amp; Practice
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "Patience",
                desc: "The best moments can't be rushed. I wait for the light, the gesture, the alignment of elements that transforms a scene into an image.",
              },
              {
                icon: Eye,
                title: "Authenticity",
                desc: "I don't stage or direct. The most powerful photographs are those that capture genuine moments — unposed, unrehearsed, true.",
              },
              {
                icon: Feather,
                title: "Simplicity",
                desc: "Minimal gear, minimal interference, minimal post-processing. I strive to let the subject speak without unnecessary embellishment.",
              },
            ].map((item, i) => (
              <GlowCard
                key={item.title}
                glowColor={
                  ["blue", "purple", "green"][i] as "blue" | "purple" | "green"
                }
                customSize
                className="p-8"
              >
                <item.icon
                  size={24}
                  className="mb-4 text-accent"
                  strokeWidth={1.5}
                />
                <h3 className="font-sans text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="font-mono text-sm leading-relaxed text-secondary dark:text-dark-secondary">
                  {item.desc}
                </p>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-24 dark:border-dark-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-sans text-3xl font-bold sm:text-4xl">
            Let&apos;s Create Together
          </h2>
          <p className="mt-4 font-mono text-base text-secondary dark:text-dark-secondary">
            Interested in working together? I&apos;m available for portrait
            sessions, event coverage, and creative collaborations.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
