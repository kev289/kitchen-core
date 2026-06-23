import connectDB from "../lib/mongodb";
import { Favorite } from "../models/Favorite";
import { IFavorite } from "../types/IFavorite";

export class FavoriteService {
  static async getFavoritesByUser(userId: string): Promise<IFavorite[]> {
    await connectDB();
    return await Favorite.find({ userId }).populate("recipeId");
  }

  static async toggleFavorite(userId: string, recipeId: string) {
    await connectDB();

    const existingFavorite = await Favorite.findOne({ userId, recipeId });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return { message: "Receta eliminada de favoritos", isFavorite: false };
    }

    const newFavorite = new Favorite({
      userId,
      recipeId,
    });
    
    await newFavorite.save();
    return { message: "Receta agregada a favoritos", isFavorite: true };
  }
}