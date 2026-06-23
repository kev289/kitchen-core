import mongoose from "mongoose";

export interface IFavorite {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId;
}