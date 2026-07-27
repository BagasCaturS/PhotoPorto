import { useMemo } from "react"
import { Shuffle } from "lucide-react"
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
  onRandomSelect?: () => void
}

export default function PhotoGrid({ photos, onToggleSelect, onToggleFeatured, onSetHero, onEdit, onDelete, onRandomSelect }: Props) {
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
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs text-secondary dark:text-dark-secondary">
          {selectedCount} / {MAX_SELECTED} selected &middot; {featuredCount} / 4 featured
        </p>
        {onRandomSelect && (
          <button
            onClick={onRandomSelect}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-xs text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border dark:text-dark-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent"
            title="Pilih 30 foto secara acak"
          >
            <Shuffle size={12} />
            Pilih Acak 30
          </button>
        )}
      </div>
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
