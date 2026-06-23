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
            throw new Error("El correo ya está registrado"); 
        }

        const hashPassword = await authLib.hashPassword(data.password);

        const newUser = await UserModel.create({
            name: data.name.trim(),
            email: emailSanitized,
            password: hashPassword,
        });

        sendEmail(newUser.email, "¡Bienvenido a GourmetDev!", "<p>Gracias por registrarte en nuestra plataforma de recetas.</p>")
          .catch(() => console.log("[AUTH] Email skipped — no rompe el registro"));

        return newUser;
    },

    login: async (data: LoginInput): Promise<ILoginResponse> => {
        await connectDB();

        const emailSanitized = data.email.toLowerCase().trim();

        const user = await UserModel.findOne({ email: emailSanitized });
        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isPasswordValid = await authLib.comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Credenciales inválidas");
        }

        if (!user._id) {
            throw new Error("Error en el identificador del usuario");
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
            throw new Error("Usuario no encontrado");
        }
        return user;
    }
};