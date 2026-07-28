import { memo } from "react"
import Image from "next/image"
import { Star, Pencil, Trash2, Check } from "lucide-react"
import type { Photo } from "./types"

interface Props {
  photo: Photo
  onToggleSelect: (photo: Photo) => void
  onToggleFeatured: (photo: Photo) => void
  onSetHero: (photo: Photo) => void
  onEdit: (photo: Photo) => void
  onDelete: (photo: Photo) => void
}

function PhotoCard({ photo, onToggleSelect, onToggleFeatured, onSetHero, onEdit, onDelete }: Props) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
        photo.selected
          ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]"
          : "border-border/50 dark:border-dark-border/50 hover:border-border dark:hover:border-dark-border"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted dark:bg-dark-muted">
        <Image
          src={photo.url}
          alt={photo.title || photo.filename}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          className="object-cover transition-all duration-500 group-hover:scale-105"
        />

        {photo.selected && (
          <div className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white shadow-sm">
            Selected
          </div>
        )}

        <div className="absolute right-2 top-2 flex gap-1">
          <button
            onClick={() => onToggleFeatured(photo)}
            className={`cursor-pointer rounded-full p-1.5 backdrop-blur-sm transition-colors ${
              photo.is_featured
                ? "bg-rose-500/90 text-white shadow-sm"
                : "bg-black/40 text-white/80 hover:bg-rose-500/80 hover:text-white"
            }`}
            title={photo.is_featured ? "Remove featured" : "Set as featured"}
          >
            <span className="text-[11px] font-bold leading-none tracking-wider">F</span>
          </button>
          <button
            onClick={() => onSetHero(photo)}
            className={`cursor-pointer rounded-full p-1.5 backdrop-blur-sm transition-colors ${
              photo.is_hero
                ? "bg-amber-500/90 text-white shadow-sm"
                : "bg-black/40 text-white/80 hover:bg-amber-500/80 hover:text-white"
            }`}
            title={photo.is_hero ? "Current hero" : "Set as hero background"}
          >
            <Star size={13} />
          </button>
        </div>
      </div>

      <div className="border-t border-border/50 px-3 py-2.5 dark:border-dark-border/50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-semibold">
              {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
            </p>
            <p className="truncate font-mono text-[11px] text-secondary dark:text-dark-secondary">
              {photo.category || "Uncategorized"}
              {photo.is_hero && (
                <span className="ml-2 text-amber-500 dark:text-amber-400">· Hero</span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => onToggleSelect(photo)}
              className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                photo.selected
                  ? "bg-accent/10 text-accent"
                  : "text-secondary hover:bg-muted hover:text-foreground dark:text-dark-secondary dark:hover:bg-dark-muted dark:hover:text-dark-foreground"
              }`}
              title={photo.selected ? "Deselect" : "Select"}
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => onEdit(photo)}
              className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-muted hover:text-foreground dark:text-dark-secondary dark:hover:bg-dark-muted dark:hover:text-dark-foreground"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(photo)}
              className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-destructive/10 hover:text-destructive dark:text-dark-secondary dark:hover:text-destructive"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {photo.is_featured && (
          <div className="mt-1.5 text-[11px] font-medium text-rose-500 dark:text-rose-400">
            · Featured
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(PhotoCard)
