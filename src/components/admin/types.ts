export interface Photo {
  id: string
  url: string
  filename: string
  selected: boolean
  display_order: number
  title: string
  description: string
  category: string
  is_hero: boolean
  is_featured: boolean
}

export const MAX_SELECTED = 30
export const MAX_FEATURED = 4
export const CATEGORIES = ["Portrait", "Landscape", "Street", "Architecture", "Nature", "Detail"]
