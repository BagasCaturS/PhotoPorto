"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Journal {
  id: string
  slug: string
  title: string
  published: boolean
  created_at: string
}

export default function AdminJournals() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJournals = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("journals")
      .select("id, slug, title, published, created_at")
      .order("created_at", { ascending: false })
    setJournals(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchJournals()
  }, [fetchJournals])

  const handleDelete = useCallback(async (slug: string) => {
    if (!confirm("Delete this entry?")) return

    setJournals((prev) => prev.filter((j) => j.slug !== slug))

    const res = await fetch(`/api/journals/${slug}`, { method: "DELETE" })

    if (!res.ok) {
      await fetchJournals()
    }
  }, [fetchJournals])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-sans text-2xl font-bold">Journal Management</h2>
        <Link
          href="/journal/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-mono text-sm font-medium text-background transition-all hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
        >
          <Plus size={16} />
          New Entry
        </Link>
      </div>

      {journals.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-mono text-base text-secondary dark:text-dark-secondary">
            No journal entries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {journals.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-border px-5 py-4 dark:border-dark-border"
            >
              <div className="flex items-center gap-3">
                <div>
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="font-sans text-lg font-semibold transition-colors hover:text-accent"
                  >
                    {entry.title}
                  </Link>
                  <p className="font-mono text-xs text-secondary dark:text-dark-secondary">
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {!entry.published && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 px-2.5 py-0.5 font-mono text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/journal/edit/${entry.slug}`}
                  className="cursor-pointer rounded-xl border border-border p-2 transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(entry.slug)}
                  className="cursor-pointer rounded-xl border border-destructive/30 p-2 text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
