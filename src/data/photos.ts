export interface Photo {
  id: string
  src: string
  title: string
  description: string
  category: string
  width: number
  height: number
}

export const categories_all = [
  "Portrait",
  "Landscape",
  "Street",
  "Architecture",
  "Nature",
  "Detail",
]

const rawFiles = [
  "_DSF0057 (1).webp",
  "_DSF0079 (1).webp",
  "_DSF0082 (1).webp",
  "_DSF0088.webp",
  "_DSF0109.webp",
  "_DSF0172.webp",
  "_DSF0880.webp",
  "_DSF1009.webp",
  "_DSF1015 (1).webp",
  "_DSF1075.webp",
  "_DSF1090.webp",
  "_DSF1738.webp",
  "_DSF1822.webp",
  "_DSF1906.webp",
  "_DSF2037.webp",
  "_DSF2106.webp",
  "_DSF2112.webp",
  "_DSF2134.webp",
  "_DSF2216.webp",
  "_DSF2513.webp",
  "_DSF3570.webp",
  "_DSF3603.webp",
  "_DSF9514.webp",
  "_DSF9546 (1).webp",
  "_DSF9871.webp",
  "_DSF9881 (1).webp",
  "_DSF9886.webp",
]

const categories = [
  "Portrait", "Landscape", "Street", "Architecture", "Nature", "Detail",
]

const titles = [
  "Silent Contemplation", "Urban Solitude", "Golden Hour",
  "Shadows & Light", "Midnight Reverie", "City Frames",
  "Ethereal Glow", "Concrete Jungle", "Serenity",
  "Parallel Lines", "The Wait", "Morning Haze",
  "Reflections", "Crossing Paths", "Still Life",
  "The Observer", "Depth of Field", "Monochrome Dreams",
  "Temporal Shift", "Natural Geometry", "Passing Through",
  "Fragments", "Horizon Line", "In Between",
  "First Light", "Contrast", "Last Frame",
]

const descriptions = [
  "A quiet moment captured in monochrome, where light carves form from shadow.",
  "Loneliness and beauty intersect in the urban landscape.",
  "The magic hour paints everything in warm, fleeting light.",
  "Where shadows define space and light reveals texture.",
  "Nightfall brings a quiet intensity to the frame.",
  "The city as a grid of endless possibilities.",
  "Soft light transforms the ordinary into something ethereal.",
  "Architecture as a mirror of the human condition.",
  "Finding stillness in a moving world.",
  "Geometry and chance intersect on the street.",
  "A study in patience and observation.",
  "Morning mist softens the edges of reality.",
  "Water as a canvas for light and color.",
  "Journeys intersect in the urban landscape.",
  "Ordinary objects, extraordinary light.",
  "The photographer watches the world unfold.",
  "Playing with focus to reveal hidden patterns.",
  "Dreams rendered in shades of gray.",
  "Time flows differently through the lens.",
  "Nature's patterns mirror our own.",
  "A fleeting moment on the move.",
  "Breaking the whole into beautiful pieces.",
  "Where sky meets earth, boundaries blur.",
  "The spaces between moments.",
  "Dawn breaks, and the world begins again.",
  "Light and dark in perfect balance.",
  "The final frame before the story ends.",
]

export const fallbackPhotos: Photo[] = rawFiles.map((file, i) => ({
  id: `photo-${i + 1}`,
  src: `/photography/${encodeURIComponent(file)}`,
  title: titles[i % titles.length],
  description: descriptions[i % descriptions.length],
  category: categories[i % categories.length],
  width: i % 3 === 0 ? 2400 : 3600,
  height: i % 3 === 0 ? 3600 : 2400,
}))

export async function fetchPhotos(): Promise<Photo[]> {
  try {
    const res = await fetch("/api/photos")
    if (!res.ok) throw new Error("Failed to fetch")
    const data = await res.json()
    const selected = data.filter((p: { selected: boolean }) => p.selected)
    if (selected.length === 0) return fallbackPhotos
    return selected.map(
      (p: {
        id: string
        url: string
        filename: string
        title: string
        description: string
        category: string
        display_order: number
      }) => ({
        id: p.id,
        src: p.url,
        title: p.title || p.filename.replace(/\.[^.]+$/, ""),
        description: p.description || "",
        category: p.category || categories[p.display_order % categories.length],
        width: 2400,
        height: 3600,
      })
    )
  } catch {
    return fallbackPhotos
  }
}
