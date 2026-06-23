import { NextResponse } from "next/server";
import { RecipeService } from "@/services/recipe.service";

export async function GET() {
  try {
    const recipes = await RecipeService.getAllRecipes();
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener las recetas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRecipe = await RecipeService.createRecipe(body);
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear la receta" }, { status: 400 });
  }
}