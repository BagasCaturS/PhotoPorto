import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SUPABASE_STORAGE_RE = /^https:\/\/[^/]+\/storage\/v1\/object\/public\/.+\//i

export function getThumbUrl(url: string, width = 250): string {
  if (!url) return url
  if (SUPABASE_STORAGE_RE.test(url)) {
    const sep = url.includes("?") ? "&" : "?"
    return `${url}${sep}width=${width}&quality=30`
  }
  return url
}
