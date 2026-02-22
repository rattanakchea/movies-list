import { useState, useEffect, useCallback } from "react";
import { SavedMovie, CollectionCategory } from "@/types/movie";
import type { Movie } from "@/types/movie";

const STORAGE_KEY = "movielist-collection";

function loadCollection(): SavedMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollection(items: SavedMovie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCollection() {
  const [collection, setCollection] = useState<SavedMovie[]>(loadCollection);

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  const addMovie = useCallback((movie: Movie, category: CollectionCategory) => {
    setCollection((prev) => {
      if (prev.some((s) => s.movie.id === movie.id)) return prev;
      return [...prev, { movie, category, note: "", addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeMovie = useCallback((movieId: string) => {
    setCollection((prev) => prev.filter((s) => s.movie.id !== movieId));
  }, []);

  const updateCategory = useCallback((movieId: string, category: CollectionCategory) => {
    setCollection((prev) =>
      prev.map((s) => (s.movie.id === movieId ? { ...s, category } : s))
    );
  }, []);

  const updateNote = useCallback((movieId: string, note: string) => {
    setCollection((prev) =>
      prev.map((s) => (s.movie.id === movieId ? { ...s, note } : s))
    );
  }, []);

  const isInCollection = useCallback(
    (movieId: string) => collection.some((s) => s.movie.id === movieId),
    [collection]
  );

  const getCategory = useCallback(
    (movieId: string) => collection.find((s) => s.movie.id === movieId)?.category,
    [collection]
  );

  return { collection, addMovie, removeMovie, updateCategory, updateNote, isInCollection, getCategory };
}
