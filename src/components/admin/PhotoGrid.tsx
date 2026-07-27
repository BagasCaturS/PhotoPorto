import { useMemo } from "react"
import { Shuffle, X } from "lucide-react"
import PhotoCard from "./PhotoCard"
import type { Photo } from "./types"
import { MAX_SELECTED } from "./types"

interface Props {
  photos: Photo[]
  loading?: boolean
  onToggleSelect: (photo: Photo) => void
  onToggleFeatured: (photo: Photo) => void
  onSetHero: (photo: Photo) => void
  onEdit: (photo: Photo) => void
  onDelete: (photo: Photo) => void
  onRandomSelect?: () => void
  onClearSelection?: () => void
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 dark:border-dark-border/50">
      <div className="aspect-[4/3] animate-pulse bg-muted dark:bg-dark-muted" />
      <div className="space-y-2 border-t border-border/50 p-3 dark:border-dark-border/50">
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted dark:bg-dark-muted" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/60 dark:bg-dark-muted/60" />
      </div>
    </div>
  )
}

export default function PhotoGrid({
  photos, loading,
  onToggleSelect, onToggleFeatured, onSetHero, onEdit, onDelete,
  onRandomSelect, onClearSelection,
}: Props) {
  const selectedCount = useMemo(() => photos.filter((p) => p.selected).length, [photos])
  const featuredCount = useMemo(() => photos.filter((p) => p.is_featured).length, [photos])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 dark:border-dark-border">
        <div className="mb-4 text-secondary dark:text-dark-secondary">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="font-mono text-sm text-secondary dark:text-dark-secondary">
          No photos yet
        </p>
        <p className="mt-1 font-mono text-xs text-secondary/60 dark:text-dark-secondary/60">
          Upload your first photo to get started
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs tabular-nums text-secondary dark:text-dark-secondary">
            <span className={selectedCount > 0 ? "text-foreground dark:text-dark-foreground font-semibold" : ""}>
              {selectedCount}
            </span>
            {" / "}{MAX_SELECTED} selected
            <span className="mx-2">·</span>
            {featuredCount} / 4 featured
          </p>
          {selectedCount > 0 && onClearSelection && (
            <button
              onClick={onClearSelection}
              className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-secondary transition-colors hover:text-destructive dark:text-dark-secondary dark:hover:text-destructive"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
        {onRandomSelect && (
          <button
            onClick={onRandomSelect}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1 font-mono text-[11px] text-secondary transition-colors hover:border-accent hover:text-accent dark:border-dark-border/60 dark:text-dark-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent"
            title="Pilih 30 foto secara acak"
          >
            <Shuffle size={12} />
            Pilih Acak
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
