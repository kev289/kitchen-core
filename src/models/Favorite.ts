import mongoose, { Model, Schema } from "mongoose";
import { IFavorite } from "@/types/IFavorite";

const FavoriteSchema = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        recipeId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Recipe', 
            required: true 
        }
    },
    { 
        timestamps: true,
        collection: 'favorites'
    }
);

FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const Favorite: Model<IFavorite> =
    mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);