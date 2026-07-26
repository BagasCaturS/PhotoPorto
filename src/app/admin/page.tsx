"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ photos: 0, selected: 0, journals: 0 })

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { count: photos } = await supabase
        .from("photos")
        .select("*", { count: "exact", head: true })
      const { count: selected } = await supabase
        .from("photos")
        .select("*", { count: "exact", head: true })
        .eq("selected", true)
      const { count: journals } = await supabase
        .from("journals")
        .select("*", { count: "exact", head: true })
      setStats({
        photos: photos || 0,
        selected: selected || 0,
        journals: journals || 0,
      })
    }
    fetch()
  }, [])

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
          value: stats.journals,
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
          <p className="mt-2 font-sans text-3xl font-bold">{card.value}</p>
        </Link>
      ))}
    </div>
  )
}
