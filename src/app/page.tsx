import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";

async function getRecipes() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/recipes`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const recipes = await getRecipes();

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Recetas Gourmet
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-lg mx-auto">
            Descubre, guarda y comparte las mejores recetas de cocina
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
            >
              + Comparte tu receta
            </Link>
            {recipes.length > 0 && (
              <span className="text-sm text-gray-400">
                {recipes.length} recetas
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {recipes.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4 opacity-30">🍽</p>
              <p className="text-gray-400 text-lg">No hay recetas todavía</p>
              <p className="text-gray-400 text-sm mt-1">¡Sé el primero en compartir una!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe: {
                _id: string;
                name: string;
                image: string;
                preparationTime: number;
                difficulty: "Easy" | "Medium" | "Hard";
              }) => (
                <RecipeCard key={recipe._id} {...recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
