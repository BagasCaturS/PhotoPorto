import type { JournalEntry } from "@/data/journal"

function mapEntry(raw: Record<string, unknown>): JournalEntry {
  return {
    id: raw.id as string,
    slug: raw.slug as string,
    title: raw.title as string,
    excerpt: (raw.excerpt as string) || "",
    content: (raw.content as string[]) || [],
    date: (raw.date as string) || "",
    coverSrc: (raw.cover_src as string) || "",
    tags: (raw.tags as string[]) || [],
    created_at: raw.created_at as string | undefined,
  }
}

export function fetchJournals(): Promise<JournalEntry[]> {
  return fetch("/api/journals")
    .then((r) => r.json())
    .then((data: Record<string, unknown>[]) => data.map(mapEntry))
}

export function fetchJournal(slug: string): Promise<JournalEntry> {
  return fetch(`/api/journals/${slug}`).then((r) => {
    if (!r.ok) throw new Error("Not found")
    return r.json().then(mapEntry)
  })
}

export async function createJournal(
  data: Omit<JournalEntry, "id" | "slug" | "date" | "created_at" | "updated_at">
): Promise<JournalEntry> {
  const res = await fetch("/api/journals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Failed to create")
  }
  const raw = await res.json()
  return mapEntry(raw)
}

export async function updateJournal(
  slug: string,
  data: Partial<JournalEntry>
): Promise<void> {
  const res = await fetch(`/api/journals/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Failed to update")
  }
}

export async function deleteJournal(slug: string): Promise<void> {
  const res = await fetch(`/api/journals/${slug}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Failed to delete")
  }
}
