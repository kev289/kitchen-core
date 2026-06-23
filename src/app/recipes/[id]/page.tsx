import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@heroui/react/card";
import { ArrowLeft, Clock, Users } from "lucide-react";

const difficultyConfig: Record<string, { label: string; class: string }> = {
  Easy: { label: "Fácil", class: "bg-emerald-50 text-emerald-600" },
  Medium: { label: "Media", class: "bg-amber-50 text-amber-600" },
  Hard: { label: "Difícil", class: "bg-rose-50 text-rose-600" },
};

type Props = {
  readonly params: Promise<{ id: string }>;
};

async function getRecipe(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/recipes/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  const diff = difficultyConfig[recipe.difficulty] || { label: recipe.difficulty, class: "bg-gray-100 text-gray-600" };

  return (
    <div className="flex flex-col flex-1">
      <div className="max-w-3xl mx-auto px-4 py-8 w-full">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        {/* Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 mb-8 shadow-sm border border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
        </div>

        {/* Title + meta */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-10">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {recipe.preparationTime} min
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${diff.class}`}>
            {diff.label}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {recipe.servings} porciones
          </span>
        </div>

        {/* Ingredients + Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-100/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Ingredientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-100/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Pasos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <p className="pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
