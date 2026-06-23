import { NextResponse } from "next/server";
import { RecipeService } from "@/services/recipe.service";
import { RecipeValidation } from "@/lib/validations";
import { authLib } from "@/lib/auth";

export async function GET() {
  try {
    const recipes = await RecipeService.getAllRecipes();
    return NextResponse.json(recipes, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error fetching recipes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = RecipeValidation.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.issues }, { status: 400 });
    }

    const userId = await authLib.getUserIdFromRequest(req);
    const newRecipe = await RecipeService.createRecipe({
      ...validatedData.data,
      author: userId,
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal error processing recipe" }, { status: 500 });
  }
}
