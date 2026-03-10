import { useState, useEffect, useCallback } from "react";
import { SavedMovie, CollectionCategory } from "@/types/movie";
import type { Movie } from "@/types/movie";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const STORAGE_KEY = "movielist-collection";

function loadLocalCollection(): SavedMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCollection(items: SavedMovie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCollection(user?: User | null) {
  const [collection, setCollection] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  // Load collection from DB or localStorage
  useEffect(() => {
    if (user) {
      loadFromDb();
    } else {
      setCollection(loadLocalCollection());
      setLoading(false);
    }
  }, [user?.id]);

  async function loadFromDb() {
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_movies")
      .select("*")
      .order("added_at", { ascending: false });

    if (!error && data) {
      setCollection(
        data.map((row: any) => ({
          movie: row.movie_data as Movie,
          category: row.category as CollectionCategory,
          note: row.note || "",
          addedAt: row.added_at,
        }))
      );
    }
    setLoading(false);
  }

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      saveLocalCollection(collection);
    }
  }, [collection, user]);

  const addMovie = useCallback(
    async (movie: Movie, category: CollectionCategory) => {
      if (collection.some((s) => s.movie.id === movie.id)) return;

      const newEntry: SavedMovie = {
        movie,
        category,
        note: "",
        addedAt: new Date().toISOString(),
      };

      setCollection((prev) => [...prev, newEntry]);

      if (user) {
        await supabase.from("saved_movies").insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_data: movie as any,
          category,
          note: "",
        });
      }
    },
    [collection, user]
  );

  const removeMovie = useCallback(
    async (movieId: string) => {
      setCollection((prev) => prev.filter((s) => s.movie.id !== movieId));

      if (user) {
        await supabase
          .from("saved_movies")
          .delete()
          .eq("movie_id", movieId)
          .eq("user_id", user.id);
      }
    },
    [user]
  );

  const updateCategory = useCallback(
    async (movieId: string, category: CollectionCategory) => {
      setCollection((prev) =>
        prev.map((s) => (s.movie.id === movieId ? { ...s, category } : s))
      );

      if (user) {
        await supabase
          .from("saved_movies")
          .update({ category })
          .eq("movie_id", movieId)
          .eq("user_id", user.id);
      }
    },
    [user]
  );

  const updateNote = useCallback(
    async (movieId: string, note: string) => {
      setCollection((prev) =>
        prev.map((s) => (s.movie.id === movieId ? { ...s, note } : s))
      );

      if (user) {
        await supabase
          .from("saved_movies")
          .update({ note })
          .eq("movie_id", movieId)
          .eq("user_id", user.id);
      }
    },
    [user]
  );

  const isInCollection = useCallback(
    (movieId: string) => collection.some((s) => s.movie.id === movieId),
    [collection]
  );

  const getCategory = useCallback(
    (movieId: string) =>
      collection.find((s) => s.movie.id === movieId)?.category,
    [collection]
  );

  return {
    collection,
    loading,
    addMovie,
    removeMovie,
    updateCategory,
    updateNote,
    isInCollection,
    getCategory,
  };
}
