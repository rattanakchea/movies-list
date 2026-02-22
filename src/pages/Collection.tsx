import { useState } from "react";
import { CollectionCategory, CATEGORY_LABELS } from "@/types/movie";
import type { Movie } from "@/types/movie";
import { useCollection } from "@/hooks/useCollection";
import Header from "@/components/Header";
import MovieDetailModal from "@/components/MovieDetailModal";
import { Star, StickyNote, Trash2, Library } from "lucide-react";

const Collection = () => {
  const { collection, removeMovie, updateCategory, updateNote, isInCollection, getCategory } =
    useCollection();
  const [activeTab, setActiveTab] = useState<CollectionCategory | "all">("all");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const tabs: { key: CollectionCategory | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "watching", label: "Watching" },
    { key: "watched", label: "Watched" },
    { key: "to-watch", label: "To Watch" },
  ];

  const filtered =
    activeTab === "all"
      ? collection
      : collection.filter((s) => s.category === activeTab);

  const savedEntry = selectedMovie
    ? collection.find((s) => s.movie.id === selectedMovie.id)
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            My Collection
          </h1>
          <p className="mt-2 text-muted-foreground">
            {collection.length} movie{collection.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border pb-px">
          {tabs.map((tab) => {
            const count =
              tab.key === "all"
                ? collection.length
                : collection.filter((s) => s.category === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-orange rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Library className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">No movies yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Head to Discover to find movies to add
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((saved) => (
              <div
                key={saved.movie.id}
                onClick={() => setSelectedMovie(saved.movie)}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 card-hover cursor-pointer"
              >
                {/* Mini poster */}
                <div className="flex h-16 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <span className="font-display text-lg font-bold text-muted-foreground/30">
                    {saved.movie.title.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-card-foreground truncate">{saved.movie.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{saved.movie.year}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span>{saved.movie.rating}</span>
                    </div>
                    <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
                      {CATEGORY_LABELS[saved.category]}
                    </span>
                  </div>
                  {saved.note && (
                    <div className="mt-1.5 flex items-start gap-1 text-xs text-muted-foreground">
                      <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">{saved.note}</span>
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMovie(saved.movie.id);
                  }}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isInCollection={isInCollection(selectedMovie.id)}
          currentCategory={getCategory(selectedMovie.id)}
          currentNote={savedEntry?.note}
          onAdd={(cat) => {}}
          onRemove={() => {
            removeMovie(selectedMovie.id);
            setSelectedMovie(null);
          }}
          onUpdateCategory={(cat) => updateCategory(selectedMovie.id, cat)}
          onUpdateNote={(note) => updateNote(selectedMovie.id, note)}
        />
      )}
    </div>
  );
};

export default Collection;
