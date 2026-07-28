"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "gallery", label: "Gallery" },
  { id: "featured", label: "Featured" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const

export default function ScrollTimeline() {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)

      let current: string | null = null
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.4) {
            current = s.label
          }
        }
      }
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="fixed right-2 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 lg:gap-3"
      aria-hidden="true"
    >
      <div className="relative w-px h-28 sm:h-48 lg:h-64 bg-border/40 dark:bg-dark-border/40 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-accent dark:bg-dark-accent transition-all duration-150 ease-out rounded-full"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
            }}
            className="group relative flex items-center justify-center"
          >
            <span
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeSection === s.label
                  ? "bg-accent dark:bg-dark-accent scale-150"
                  : "bg-border dark:bg-dark-border group-hover:bg-secondary dark:group-hover:bg-dark-secondary"
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-wider uppercase text-secondary dark:text-dark-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
