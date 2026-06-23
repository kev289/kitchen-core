import connectDB from "@/lib/mongodb";
import { User as UserModel } from "@/models/User";
import { authLib } from "@/lib/auth";
import { IUser } from "@/types/IUser";
import z from "zod";
import { LoginValidation } from "@/lib/validations";
import { ILoginResponse } from "@/types/IAuth";
import { sendEmail } from "@/services/email.service";

type LoginInput = z.infer<typeof LoginValidation>;

export const userService = {
    register: async (data: IUser & { readonly confirmPassword?: string }): Promise<IUser> => {
        await connectDB();

        const emailSanitized = data.email.toLowerCase().trim();

        const existingUser = await UserModel.findOne({ email: emailSanitized });
        if (existingUser) {
            throw new Error("Email is already registered"); 
        }

        const hashPassword = await authLib.hashPassword(data.password);

        const newUser = await UserModel.create({
            name: data.name.trim(),
            email: emailSanitized,
            password: hashPassword,
        });

        const html = `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f9f9f9; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 40px;">🍽</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; color: #111; margin: 0 0 8px; text-align: center;">
              ¡Bienvenido, ${newUser.name}!
            </h1>
            <p style="font-size: 15px; color: #555; line-height: 1.6; text-align: center; margin: 0 0 24px;">
              Gracias por registrarte en <strong>GourmetDev</strong>. Ya podés descubrir, guardar y compartir las mejores recetas de cocina.
            </p>
            <a href="${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/login"
               style="display: block; width: fit-content; margin: 0 auto; padding: 12px 32px; background: #111; color: #fff; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 600;">
              Empezar a cocinar
            </a>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0 16px;" />
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              GourmetDev — Recetas para todos los gustos
            </p>
          </div>
        `;

        sendEmail(newUser.email, "¡Bienvenido a GourmetDev!", html)
          .catch(() => console.log("[AUTH] Email skipped — registration still succeeds"));

        return newUser;
    },

    login: async (data: LoginInput): Promise<ILoginResponse> => {
        await connectDB();

        const emailSanitized = data.email.toLowerCase().trim();

        const user = await UserModel.findOne({ email: emailSanitized });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await authLib.comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        if (!user._id) {
            throw new Error("Invalid user identifier");
        }

        const payload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        };

        const accessToken = await authLib.generateAccessToken(payload);
        const refreshToken = await authLib.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user: {
                name: user.name,
                email: user.email
            },
        };
    },

    getUserById: async (id: string) => {
        await connectDB();
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
};