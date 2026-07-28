export interface JournalEntry {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  coverSrc: string
  tags: string[]
  published: boolean
  created_at?: string
}


