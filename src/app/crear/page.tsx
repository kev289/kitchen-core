"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@heroui/react/card";
import { Button } from "@heroui/react/button";

const dificultades = [
  { label: "Fácil", value: "Easy" },
  { label: "Media", value: "Medium" },
  { label: "Difícil", value: "Hard" },
];

export default function CrearRecetaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIngredientChange = (i: number, value: string) => {
    const copy = [...ingredients];
    copy[i] = value;
    setIngredients(copy);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);

  const removeIngredient = (i: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, idx) => idx !== i));
    }
  };

  const handleStepChange = (i: number, value: string) => {
    const copy = [...steps];
    copy[i] = value;
    setSteps(copy);
  };

  const addStep = () => setSteps([...steps, ""]);

  const removeStep = (i: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, idx) => idx !== i));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const filteredIngredients = ingredients.filter((i) => i.trim());
    const filteredSteps = steps.filter((s) => s.trim());

    if (filteredIngredients.length === 0) {
      setError("Agrega al menos un ingrediente");
      return;
    }
    if (filteredSteps.length === 0) {
      setError("Agrega al menos un paso");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim(),
          preparationTime: Number(preparationTime),
          difficulty,
          servings: Number(servings),
          ingredients: filteredIngredients,
          steps: filteredSteps,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Error al crear la receta");
      }

      router.push(`/recipes/${data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la receta");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <CardTitle className="text-2xl">Crear receta</CardTitle>
          <CardDescription>Comparte tu receta con la comunidad</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre de la receta</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Ej: Pasta al pesto"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1">URL de la imagen</label>
              <input
                id="image"
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="time" className="block text-sm font-medium mb-1">Tiempo (minutos)</label>
                <input
                  id="time"
                  type="number"
                  required
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="30"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="servings" className="block text-sm font-medium mb-1">Porciones</label>
                <input
                  id="servings"
                  type="number"
                  required
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="4"
                />
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Dificultad</label>
              <select
                id="difficulty"
                required
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="" disabled>Selecciona una dificultad</option>
                {dificultades.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Ingredientes</label>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={ing}
                    onChange={(e) => handleIngredientChange(i, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder={`Ingrediente ${i + 1}`}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="text-red-500 hover:text-red-700 text-lg px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm text-primary font-medium hover:underline"
              >
                + Agregar ingrediente
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Pasos</label>
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2.5 text-sm font-medium text-gray-500 w-6">
                    {i + 1}.
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[38px] resize-y"
                    placeholder={`Paso ${i + 1}`}
                    rows={1}
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="text-red-500 hover:text-red-700 text-lg px-2 mt-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="text-sm text-primary font-medium hover:underline"
              >
                + Agregar paso
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" isDisabled={loading} className="w-full bg-gray-900 text-white hover:bg-gray-800" size="lg">
              {loading ? "Publicando..." : "Publicar receta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
