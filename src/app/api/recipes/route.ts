import { NextResponse } from "next/server";
import { RecipeService } from "@/services/recipe.service";
import { jwtVerify } from "jose";
import { RecipeValidation } from "@/lib/validations";

async function getUserIdFromToken(req: Request) {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.id as string;
}

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

        const validatedData = RecipeValidation.safeParse(body);

        if (!validatedData.success) {

            return NextResponse.json({ error: validatedData.error.issues }, { status: 400 });
        }

        const userId = await getUserIdFromToken(req);
        const newRecipe = await RecipeService.createRecipe({
            ...validatedData.data,
            author: userId
        });

        return NextResponse.json(newRecipe, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error interno al procesar la receta" }, { status: 500 });
    }
}