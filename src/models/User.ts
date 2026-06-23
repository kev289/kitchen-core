import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "@/types/IUser";

const UserSchema: Schema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true, lowercase: true},
        email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                },
        password: { type: String, required: true}
    }, 
    { timestamps: true,
        collection: 'users'
    }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);