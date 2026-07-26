"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { fetchJournal, deleteJournal } from "@/lib/journal-api"
import { useAuth } from "@/context/AuthContext"
import { Pencil, Trash2 } from "lucide-react"
import type { JournalEntry } from "@/data/journal"

export default function JournalEntryPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [entry, setEntry] = useState<JournalEntry | undefined>(undefined)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    fetchJournal(slug)
      .then((e) => setEntry(e))
      .catch(() => {})
  }, [slug])

  const handleDelete = async () => {
    if (!entry) return
    try {
      await deleteJournal(slug)
      router.push("/journal")
    } catch {
      alert("Failed to delete")
    }
  }

  if (!entry) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="font-sans text-4xl font-bold">Entry Not Found</h1>
            <Link
              href="/journal"
              className="mt-4 inline-flex font-mono text-sm text-accent hover:underline"
            >
              &larr; Back to Journal
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="relative h-[50vh] min-h-[320px] overflow-hidden bg-foreground dark:bg-dark-foreground">
          {entry.coverSrc ? (
            <Image
              src={entry.coverSrc}
              alt={entry.title}
              fill
              className="object-cover opacity-60"
              preload
              sizes="100vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-700 to-neutral-900" />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-on-primary/20 px-3 py-1 font-mono text-xs text-on-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="font-mono text-sm text-on-primary/60 mb-2">
                {entry.date || (entry.created_at ? new Date(entry.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) : "")}
              </p>
              <h1 className="font-sans text-3xl font-bold text-on-primary sm:text-5xl">
                {entry.title}
              </h1>
            </div>
          </div>
        </div>

        <article className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-6 font-mono text-base leading-relaxed text-secondary dark:text-dark-secondary">
              {entry.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-8 flex items-center gap-4 border-t border-border pt-6 dark:border-dark-border">
                <Link
                  href={`/journal/edit/${entry.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDelete(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2 font-mono text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}

            {showDelete && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 dark:bg-destructive/10">
                <p className="font-mono text-sm mb-3">
                  Are you sure you want to delete this entry?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDelete}
                    className="inline-flex cursor-pointer items-center rounded-xl bg-destructive px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-destructive/90"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDelete(false)}
                    className="inline-flex cursor-pointer items-center rounded-xl border border-border px-4 py-2 font-mono text-sm transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-16 flex items-center justify-between border-t border-border pt-8 dark:border-dark-border">
              <Link
                href="/journal"
                className="font-mono text-sm text-accent transition-colors hover:text-accent/80"
              >
                &larr; Back to Journal
              </Link>
              <Link
                href="/#gallery"
                className="font-mono text-sm text-secondary transition-colors hover:text-foreground dark:text-dark-secondary dark:hover:text-dark-foreground"
              >
                View Gallery &rarr;
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
