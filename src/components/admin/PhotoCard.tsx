import { memo } from "react"
import { Check, X, Star, Pencil, Trash2 } from "lucide-react"
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
      className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
        photo.selected
          ? "border-accent"
          : "border-transparent hover:border-border"
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted dark:bg-dark-muted">
        <img
          src={photo.url}
          alt={photo.title || photo.filename}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-1 p-2">
        <p className="truncate font-sans text-sm font-semibold">
          {photo.title || photo.filename.replace(/\.[^.]+$/, "")}
        </p>
        <p className="truncate font-mono text-xs text-secondary dark:text-dark-secondary">
          {photo.category || "Uncategorized"}
        </p>
      </div>

      <div className="absolute inset-0 flex items-start justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onToggleSelect(photo)}
          className={`cursor-pointer rounded-full p-1.5 transition-colors ${
            photo.selected
              ? "bg-accent text-white"
              : "bg-black/50 text-white hover:bg-black/70"
          }`}
          title={photo.selected ? "Deselect" : "Select"}
        >
          {photo.selected ? <X size={14} /> : <Check size={14} />}
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => onToggleFeatured(photo)}
            className={`cursor-pointer rounded-full p-1.5 transition-colors ${
              photo.is_featured
                ? "bg-rose-500 text-white"
                : "bg-black/50 text-white hover:bg-rose-500"
            }`}
            title={photo.is_featured ? "Remove featured" : "Set as featured"}
          >
            <span className="text-xs font-bold leading-none">F</span>
          </button>
          <button
            onClick={() => onSetHero(photo)}
            className={`cursor-pointer rounded-full p-1.5 transition-colors ${
              photo.is_hero
                ? "bg-amber-500 text-white"
                : "bg-black/50 text-white hover:bg-amber-500"
            }`}
            title={photo.is_hero ? "Current hero" : "Set as hero background"}
          >
            <Star size={14} />
          </button>
          <button
            onClick={() => onEdit(photo)}
            className="cursor-pointer rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-accent"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(photo)}
            className="cursor-pointer rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-destructive"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 flex gap-1.5">
        {photo.selected && (
          <div className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-white">
            Selected
          </div>
        )}
        {photo.is_featured && (
          <div className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 font-mono text-xs text-white">
            Featured
          </div>
        )}
        {photo.is_hero && (
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 font-mono text-xs text-white">
            <Star size={10} />
            Hero
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(PhotoCard)
