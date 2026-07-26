"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { fetchJournals } from "@/lib/journal-api"
import { Plus } from "lucide-react"
import { JournalCardSkeleton } from "@/components/ui/skeleton"
import type { JournalEntry } from "@/data/journal"

const PER_PAGE = 4

export default function JournalPage() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchJournals()
      .then((entries) => setAllEntries(entries))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const totalPages = Math.max(1, Math.ceil(allEntries.length / PER_PAGE))
  const start = (page - 1) * PER_PAGE
  const visible = allEntries.slice(start, start + PER_PAGE)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-16 text-center">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
                Journal
              </p>
              <h1 className="font-sans text-4xl font-bold sm:text-5xl">
                Thoughts on Photography
              </h1>
              <p className="mt-4 font-mono text-base text-secondary dark:text-dark-secondary">
                Stories, techniques, and reflections from behind the lens.
              </p>

              {isAdmin && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Link
                    href="/journal/new"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
                  >
                    <Plus size={16} />
                    Write New Entry
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-sm font-medium transition-all duration-300 hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
                  >
                    Admin Panel
                  </Link>
                </div>
              )}
            </div>

            {!loaded ? (
              <div className="grid gap-12">
                {[1, 2, 3].map((i) => (
                  <JournalCardSkeleton key={i} reverse={i % 2 === 0} />
                ))}
              </div>
            ) : allEntries.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-mono text-base text-secondary dark:text-dark-secondary">
                  No journal entries yet.
                </p>
                {isAdmin && (
                  <Link
                    href="/journal/new"
                    className="mt-4 inline-flex font-mono text-sm text-accent hover:underline"
                  >
                    Write your first entry &rarr;
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-12">
                  {visible.map((entry, i) => (
                    <Link
                      key={entry.id}
                      href={`/journal/${entry.slug}`}
                      className={`group grid items-center gap-8 ${
                        i % 2 === 0
                          ? "lg:grid-cols-[1.2fr_1fr]"
                          : "lg:grid-cols-[1fr_1.2fr]"
                      }`}
                    >
                      <div
                        className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${
                          i % 2 === 1 ? "lg:order-2" : ""
                        }`}
                      >
                        {entry.coverSrc ? (
                          <Image
                            src={entry.coverSrc}
                            alt={entry.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-neutral-700 to-neutral-900" />
                        )}
                      </div>
                      <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-secondary dark:bg-dark-muted dark:text-dark-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="font-mono text-xs text-secondary dark:text-dark-secondary mb-2">
                          {entry.date || (entry.created_at ? new Date(entry.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }) : "")}
                        </p>
                        <h2 className="font-sans text-2xl font-bold transition-colors group-hover:text-accent sm:text-3xl">
                          {entry.title}
                        </h2>
                        <p className="mt-3 font-mono text-base leading-relaxed text-secondary dark:text-dark-secondary">
                          {entry.excerpt}
                        </p>
                        <span className="mt-4 inline-flex font-mono text-sm font-medium text-accent">
                          Read more &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-16 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="cursor-pointer rounded-xl border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30 dark:border-dark-border dark:hover:bg-dark-muted"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`cursor-pointer rounded-xl px-4 py-2 font-mono text-sm transition-colors ${
                            p === page
                              ? "bg-foreground text-background dark:bg-dark-foreground dark:text-dark-background"
                              : "border border-border hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="cursor-pointer rounded-xl border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30 dark:border-dark-border dark:hover:bg-dark-muted"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
