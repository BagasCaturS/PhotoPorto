import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SUPABASE_STORAGE_RE = /^https:\/\/[^/]+\/storage\/v1\/object\/public\//i

const STORAGE_URL_CACHE = new Map<string, string>()

export function getThumbUrl(url: string, width = 250): string {
  if (!url) return url
  const cached = STORAGE_URL_CACHE.get(url)
  if (cached) return cached

  let thumb = url
  if (SUPABASE_STORAGE_RE.test(url)) {
    const sep = url.includes("?") ? "&" : "?"
    thumb = `${url}${sep}width=${width}&quality=30`
  }
  STORAGE_URL_CACHE.set(url, thumb)
  return thumb
}
