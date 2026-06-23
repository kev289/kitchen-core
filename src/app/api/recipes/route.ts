import { NextResponse } from "next/server";
import { RecipeService } from "@/services/recipe.service";
import { jwtVerify } from "jose";
import { RecipeValidation } from "@/lib/validations";

async function getUserIdFromToken(req: Request) {
    const rawSecret = process.env.JWT_SECRET;
    if (!rawSecret) throw new Error("JWT_SECRET is not configured");
    const secret = new TextEncoder().encode(rawSecret);
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
}

export async function GET() {
    try {
        const recipes = await RecipeService.getAllRecipes();
        return NextResponse.json(recipes, { status: 200 });
    } catch {
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
    } catch {
        return NextResponse.json({ error: "Error interno al procesar la receta" }, { status: 500 });
    }
}