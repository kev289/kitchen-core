import { NextResponse } from "next/server";
import { FavoriteService } from "@/services/favorite.service";
import { jwtVerify } from 'jose';

async function getUserIdFromToken(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token!, secret);
  return payload.id as string;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromToken(req);
    const { recipeId } = await req.json();

    const result = await FavoriteService.toggleFavorite(userId, recipeId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "No autorizado o error interno" }, { status: 401 });
  }
}