import connectDB from "../lib/mongodb"; 
import { Recipe } from "../models/Recipe";
import { IRecipe } from "../types/IRecipe";

export class RecipeService {
  static async getAllRecipes(): Promise<IRecipe[]> {
    await connectDB();
    return await Recipe.find();
  }

  static async getRecipeById(id: string): Promise<IRecipe | null> {
    await connectDB();
    return await Recipe.findById(id);
  }

  static async createRecipe(recipeData: IRecipe): Promise<IRecipe> {
    await connectDB();
    const newRecipe = new Recipe(recipeData);
    return await newRecipe.save();
  }
}