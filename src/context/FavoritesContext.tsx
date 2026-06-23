"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

type FavoritesContextType = {
  favoriteIds: Set<string>;
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { readonly children: React.ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setTimeout(() => setFavoriteIds(new Set()), 0);
      return;
    }

    let cancelled = false;

    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const ids = data.map((fav: { recipeId: string | { _id: string } }) =>
          typeof fav.recipeId === "string" ? fav.recipeId : fav.recipeId._id
        );
        if (!cancelled) setFavoriteIds(new Set(ids));
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavorite = useCallback(
    (recipeId: string) => favoriteIds.has(recipeId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(async (recipeId: string): Promise<boolean> => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId }),
    });

    if (res.ok) {
      const data = await res.json();
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (data.isFavorite) {
          next.add(recipeId);
        } else {
          next.delete(recipeId);
        }
        return next;
      });
      return data.isFavorite;
    }

    return isFavorite(recipeId);
  }, [isFavorite]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  }
  return context;
}
