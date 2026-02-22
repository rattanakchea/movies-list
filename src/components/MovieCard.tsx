import { Movie } from "@/types/movie";
import { Star, Plus, Check } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  isInCollection?: boolean;
  onAdd?: () => void;
  onClick?: () => void;
}

const MovieCard = ({ movie, rank, isInCollection, onAdd, onClick }: MovieCardProps) => {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card card-hover cursor-pointer"
      onClick={onClick}
    >
      {/* Poster area */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-soft to-muted">
          <span className="font-display text-4xl font-bold text-muted-foreground/30">
            {movie.title.charAt(0)}
          </span>
        </div>

        {rank && (
          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full gradient-orange text-xs font-bold text-primary-foreground shadow-md">
            {rank}
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg transition-colors ${
                isInCollection
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {isInCollection ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Saved
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Add
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-card-foreground">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{movie.year}</span>
          <span>·</span>
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-medium text-foreground">{movie.rating}</span>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
