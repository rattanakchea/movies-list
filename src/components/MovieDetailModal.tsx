import { Movie, CollectionCategory, CATEGORY_LABELS } from "@/types/movie";
import { X, Star, Bookmark, StickyNote } from "lucide-react";
import { useState } from "react";

interface MovieDetailModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  isInCollection: boolean;
  currentCategory?: CollectionCategory;
  currentNote?: string;
  onAdd: (category: CollectionCategory) => void;
  onRemove: () => void;
  onUpdateCategory: (category: CollectionCategory) => void;
  onUpdateNote: (note: string) => void;
}

const MovieDetailModal = ({
  movie,
  isOpen,
  onClose,
  isInCollection,
  currentCategory,
  currentNote,
  onAdd,
  onRemove,
  onUpdateCategory,
  onUpdateNote,
}: MovieDetailModalProps) => {
  const [note, setNote] = useState(currentNote || "");
  const [selectedCategory, setSelectedCategory] = useState<CollectionCategory>(
    currentCategory || "to-watch"
  );

  if (!isOpen) return null;

  const handleSaveNote = () => {
    onUpdateNote(note);
  };

  const categories: CollectionCategory[] = ["watching", "watched", "to-watch"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-soft to-muted p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-card shadow-md">
              <span className="font-display text-2xl font-bold text-muted-foreground/40">
                {movie.title.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{movie.title}</h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{movie.year}</span>
                {movie.director && (
                  <>
                    <span>·</span>
                    <span>{movie.director}</span>
                  </>
                )}
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-semibold text-foreground">{movie.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((g) => (
              <span
                key={g}
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="text-sm leading-relaxed text-muted-foreground">{movie.overview}</p>

          {/* Collection controls */}
          <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Bookmark className="h-4 w-4 text-primary" />
              Collection
            </div>

            {/* Category selector */}
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (isInCollection) onUpdateCategory(cat);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    (isInCollection ? currentCategory : selectedCategory) === cat
                      ? "gradient-orange text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Add / Remove */}
            {!isInCollection ? (
              <button
                onClick={() => onAdd(selectedCategory)}
                className="w-full rounded-lg gradient-orange px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-shadow hover:shadow-lg"
              >
                Add to Collection
              </button>
            ) : (
              <button
                onClick={onRemove}
                className="w-full rounded-lg border border-destructive bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                Remove from Collection
              </button>
            )}
          </div>

          {/* Notes */}
          {isInCollection && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <StickyNote className="h-4 w-4 text-primary" />
                Note
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleSaveNote}
                placeholder="Add your thoughts about this movie..."
                className="w-full resize-none rounded-lg border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
