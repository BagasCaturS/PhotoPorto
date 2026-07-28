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
    <>
      <div
        className="fixed right-3 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <div className="relative w-px h-48 sm:h-64 bg-border/40 dark:bg-dark-border/40 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-accent dark:bg-dark-accent transition-all duration-150 ease-out rounded-full"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        <div className="flex flex-col items-center gap-2.5">
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

      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden flex-col"
        aria-hidden="true"
      >
        <div className="relative h-0.5 bg-border/30 dark:bg-dark-border/30">
          <div
            className="absolute top-0 left-0 h-full bg-accent dark:bg-dark-accent transition-all duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
          {SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
              style={{ left: `${((i + 0.5) / SECTIONS.length) * 100}%` }}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  activeSection === s.label
                    ? "w-1.5 h-1.5 bg-accent dark:bg-dark-accent"
                    : "w-1 h-1 bg-border/50 dark:bg-dark-border/50"
                }`}
              />
            </div>
          ))}
        </div>

        <nav className="flex items-center px-4 py-2.5 bg-background/80 dark:bg-dark-background/80 backdrop-blur-md border-t border-border/40 dark:border-dark-border/40">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className="flex-1 text-center"
            >
              <span
                className={`font-mono text-[10px] tracking-wider uppercase transition-all duration-300 ${
                  activeSection === s.label
                    ? "text-accent dark:text-dark-accent font-semibold"
                    : "text-secondary dark:text-dark-secondary"
                }`}
              >
                {s.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
