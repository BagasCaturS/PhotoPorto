"use client"

import { useRef, useEffect, useState } from "react"
import { Send } from "lucide-react"

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [sent, setSent] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="border-t border-border py-24 sm:py-32 dark:border-dark-border"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
            Connect
          </p>
          <h2
            className={`font-sans text-4xl font-bold sm:text-5xl transition-all duration-1000 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Let&apos;s Work Together
          </h2>
          <p
            className={`mt-6 font-mono text-base text-secondary dark:text-dark-secondary transition-all duration-1000 delay-150 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Have a project in mind? I&apos;d love to hear about it. Send me a
            message and let&apos;s create something beautiful.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`mt-12 space-y-6 transition-all duration-1000 delay-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {sent ? (
            <div className="rounded-2xl bg-muted dark:bg-dark-muted p-12 text-center">
              <p className="font-sans text-xl font-semibold">
                Message Sent
              </p>
              <p className="mt-2 font-mono text-sm text-secondary dark:text-dark-secondary">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-8 py-3 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 hover:scale-105 dark:bg-dark-foreground dark:text-dark-background dark:hover:bg-dark-foreground/90"
              >
                <Send size={16} />
                Send Message
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
