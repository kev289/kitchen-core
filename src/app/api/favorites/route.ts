import { NextResponse } from "next/server";
import { FavoriteService } from "@/services/favorite.service";
import { jwtVerify } from 'jose';

async function getUserIdFromToken(req: Request) {
  const rawSecret = process.env.JWT_SECRET;
  if (!rawSecret) throw new Error("JWT_SECRET is not configured");
  const secret = new TextEncoder().encode(rawSecret);
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) throw new Error("No token provided");
  const { payload } = await jwtVerify(token, secret);
  return payload.userId as string;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromToken(req);
    const favorites = await FavoriteService.getFavoritesByUser(userId);
    return NextResponse.json(favorites, { status: 200 });
  } catch {
    return NextResponse.json({ error: "No autorizado o error interno" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromToken(req);
    const { recipeId } = await req.json();

    const result = await FavoriteService.toggleFavorite(userId, recipeId);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "No autorizado o error interno" }, { status: 401 });
  }
}