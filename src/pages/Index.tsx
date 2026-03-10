import { useState, useMemo } from "react";
import { allMovies, popularMovies } from "@/data/movies";
import { GENRE_LIST, CollectionCategory } from "@/types/movie";
import type { Movie } from "@/types/movie";
import { useCollection } from "@/hooks/useCollection";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MovieDetailModal from "@/components/MovieDetailModal";
import { TrendingUp } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface IndexProps {
  user?: User | null;
  signOut?: () => void;
}

const Index = ({ user, signOut }: IndexProps) => {
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { collection, addMovie, removeMovie, updateCategory, updateNote, isInCollection, getCategory } =
    useCollection(user);

  const filteredMovies = useMemo(() => {
    let movies = allMovies;
    if (search) {
      const q = search.toLowerCase();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q))
      );
    }
    if (genreFilter) {
      movies = movies.filter((m) => m.genre.includes(genreFilter));
    }
    return movies;
  }, [search, genreFilter]);

  const isSearching = search || genreFilter;

  const savedEntry = selectedMovie
    ? collection.find((s) => s.movie.id === selectedMovie.id)
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-12 max-w-2xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your movies,{" "}
            <span className="text-gradient-orange">organized.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover, save, and track the movies you love. Build your personal collection with notes and categories.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <GenreFilter genres={GENRE_LIST} selected={genreFilter} onSelect={setGenreFilter} />
        </div>

        {/* Content */}
        {!isSearching && (
          <section className="mb-14">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">Top 10 Popular</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {popularMovies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  rank={i + 1}
                  isInCollection={isInCollection(movie.id)}
                  onAdd={() => addMovie(movie, "to-watch")}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          </section>
        )}

        {isSearching && (
          <section>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredMovies.length} result{filteredMovies.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInCollection={isInCollection(movie.id)}
                  onAdd={() => addMovie(movie, "to-watch")}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
            {filteredMovies.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No movies found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try a different search term or genre</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isInCollection={isInCollection(selectedMovie.id)}
          currentCategory={getCategory(selectedMovie.id)}
          currentNote={savedEntry?.note}
          onAdd={(cat: CollectionCategory) => {
            addMovie(selectedMovie, cat);
          }}
          onRemove={() => removeMovie(selectedMovie.id)}
          onUpdateCategory={(cat: CollectionCategory) => updateCategory(selectedMovie.id, cat)}
          onUpdateNote={(note: string) => updateNote(selectedMovie.id, note)}
        />
      )}
    </div>
  );
};

export default Index;
