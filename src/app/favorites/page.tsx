"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@heroui/react/card";
import { Button } from "@heroui/react/button";

type FavoriteRecipe = {
  _id: string;
  name: string;
  image: string;
  preparationTime: number;
  difficulty: string;
};

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favoriteIds } = useFavorites();
  const router = useRouter();
  const [recipes, setRecipes] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const r = data.map((fav: { recipeId: FavoriteRecipe }) => fav.recipeId);
        setRecipes(r);
      })
      .catch(() => {
        if (!cancelled) setRecipes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router, favoriteIds]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Mis favoritos</h1>
          <p className="text-gray-500 mt-1">
            {recipes.length} {recipes.length === 1 ? "receta guardada" : "recetas guardadas"}
          </p>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {recipes.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">💔</p>
              <p className="text-gray-400 mb-2">No tenés recetas favoritas todavía.</p>
              <p className="text-gray-400 text-sm mb-6">Explorá las recetas y guardá las que más te gusten.</p>
              <Link href="/">
                <Button variant="primary" className="bg-gray-900 text-white">
                  Explorar recetas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Link key={recipe._id} href={`/recipes/${recipe._id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="pb-1">
                      <CardTitle className="text-lg truncate">{recipe.name}</CardTitle>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <span className="text-sm text-gray-500">⏱ {recipe.preparationTime} min</span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
