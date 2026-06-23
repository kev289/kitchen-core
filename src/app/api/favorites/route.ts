import { NextResponse } from "next/server";
import { FavoriteService } from "@/services/favorite.service";
import { authLib } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await authLib.getUserIdFromRequest(req);
    const favorites = await FavoriteService.getFavoritesByUser(userId);
    return NextResponse.json(favorites, { status: 200 });
  } catch {
    return NextResponse.json({ error: "No autorizado o error interno" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await authLib.getUserIdFromRequest(req);
    const { recipeId } = await req.json();

    const result = await FavoriteService.toggleFavorite(userId, recipeId);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "No autorizado o error interno" }, { status: 401 });
  }
}
