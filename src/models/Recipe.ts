import mongoose, { Model, Schema } from "mongoose";
import { IRecipe } from "@/types/IRecipe";

const RecipeSchema: Schema = new Schema<IRecipe>(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        preparationTime: { type: Number, required: true },
        difficulty: { 
            type: String, 
            enum: ["Easy", "Medium", "Hard"], 
            required: true 
        },
        ingredients: { type: [String], required: true },
        steps: { type: [String], required: true },
        servings: { type: Number, required: true },
        author: { type: String, required: true, trim: true }
    },
    { 
        timestamps: true,
        collection: 'recipes'
    }
);

export const Recipe: Model<IRecipe> =
    mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);