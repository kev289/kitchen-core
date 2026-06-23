import { NextResponse } from "next/server";
import { RecipeService } from "@/services/recipe.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await RecipeService.getRecipeById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error fetching the recipe" }, { status: 500 });
  }
}
