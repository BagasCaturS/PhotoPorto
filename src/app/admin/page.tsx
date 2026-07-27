"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    photos: number
    selected: number
    journals: number
    drafts: number
    loading: boolean
  }>({ photos: 0, selected: 0, journals: 0, drafts: 0, loading: true })

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const [photosRes, selectedRes, journalsRes, draftsRes] = await Promise.all([
        supabase.from("photos").select("*", { count: "exact", head: true }),
        supabase.from("photos").select("*", { count: "exact", head: true }).eq("selected", true),
        supabase.from("journals").select("*", { count: "exact", head: true }),
        supabase.from("journals").select("*", { count: "exact", head: true }).eq("published", false),
      ])
      setStats({
        photos: photosRes.count || 0,
        selected: selectedRes.count || 0,
        journals: journalsRes.count || 0,
        drafts: draftsRes.count || 0,
        loading: false,
      })
    }
    fetch()
  }, [])

  const draftLabel = stats.drafts > 0
    ? `${stats.journals - stats.drafts} published, ${stats.drafts} draft`
    : `${stats.journals} entries`

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {[
        { label: "Total Photos", value: stats.photos, href: "/admin/photos" },
        {
          label: "Selected (max 30)",
          value: `${stats.selected} / 30`,
          href: "/admin/photos",
        },
        {
          label: "Journal Entries",
          value: draftLabel,
          href: "/admin/journals",
        },
      ].map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="rounded-2xl border border-border p-6 transition-colors hover:bg-muted dark:border-dark-border dark:hover:bg-dark-muted"
        >
          <p className="font-mono text-sm text-secondary dark:text-dark-secondary">
            {card.label}
          </p>
          {stats.loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 font-sans text-3xl font-bold">{card.value}</p>
          )}
        </Link>
      ))}
    </div>
  )
}
