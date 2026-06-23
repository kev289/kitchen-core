"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

type Props = {
  readonly recipeId: string;
};

export default function FavoriteButton({ recipeId }: Props) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const favorited = isFavorite(recipeId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    await toggleFavorite(recipeId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 cursor-pointer
        ${loading ? "opacity-50 scale-90" : "hover:scale-110"}
        ${favorited
          ? "bg-red-50 text-red-500 shadow-sm"
          : "bg-white/70 text-gray-400 hover:text-red-400 hover:bg-red-50/50"
        }`}
      aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${
          favorited ? "fill-red-500" : "fill-none"
        }`}
      />
    </button>
  );
}
