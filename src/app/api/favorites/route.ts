import { NextResponse } from "next/server";
import { FavoriteService } from "@/services/favorite.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "El userId es requerido en los query params" }, { status: 400 });
    }

    const favorites = await FavoriteService.getFavoritesByUser(userId);
    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener favoritos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, recipeId } = await req.json();

    if (!userId || !recipeId) {
      return NextResponse.json({ error: "userId y recipeId son requeridos" }, { status: 400 });
    }

    const result = await FavoriteService.toggleFavorite(userId, recipeId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la acción de favoritos" }, { status: 500 });
  }
}