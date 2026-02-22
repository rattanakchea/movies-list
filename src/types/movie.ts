export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  poster: string;
  overview: string;
  director?: string;
}

export type CollectionCategory = "watching" | "watched" | "to-watch";

export interface SavedMovie {
  movie: Movie;
  category: CollectionCategory;
  note: string;
  addedAt: string;
}

export const CATEGORY_LABELS: Record<CollectionCategory, string> = {
  watching: "Watching",
  watched: "Watched",
  "to-watch": "To Watch",
};

export const GENRE_LIST = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;
