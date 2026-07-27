import { useMemo } from "react"
import PhotoCard from "./PhotoCard"
import type { Photo } from "./types"
import { MAX_SELECTED } from "./types"

interface Props {
  photos: Photo[]
  onToggleSelect: (photo: Photo) => void
  onToggleFeatured: (photo: Photo) => void
  onSetHero: (photo: Photo) => void
  onEdit: (photo: Photo) => void
  onDelete: (photo: Photo) => void
}

export default function PhotoGrid({ photos, onToggleSelect, onToggleFeatured, onSetHero, onEdit, onDelete }: Props) {
  const selectedCount = useMemo(() => photos.filter((p) => p.selected).length, [photos])
  const featuredCount = useMemo(() => photos.filter((p) => p.is_featured).length, [photos])

  if (photos.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-base text-secondary dark:text-dark-secondary">
          No photos yet. Upload your first photo.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 font-mono text-xs text-secondary dark:text-dark-secondary">
        {selectedCount} / {MAX_SELECTED} selected &middot; {featuredCount} / 4 featured
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onToggleSelect={onToggleSelect}
            onToggleFeatured={onToggleFeatured}
            onSetHero={onSetHero}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
