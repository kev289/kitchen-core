import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

type Payload = {
    userId: string;
    email: string;
    name: string;
}

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = new TextEncoder().encode(rawSecret);

export const authLib = {
    hashPassword: (password: string) => bcrypt.hash(password, 10),
    comparePassword: (password: string, hash: string) => bcrypt.compare(password, hash),

    generateAccessToken: async ({userId, name, email}: Payload) => {
        return await new SignJWT({ userId, name, email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("15m")
        .sign(JWT_SECRET);
    },

    generateRefreshToken: async ({userId, name, email}: Payload) => {
        return await new SignJWT({ userId, name, email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
    },

    verifyAccessToken: async (token: string) => {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as Payload;
    },

    getUserIdFromRequest: async (req: Request): Promise<string> => {
        const cookieStore = await cookies();
        let token = cookieStore.get("accessToken")?.value;

        if (!token) {
            const authHeader = req.headers.get("Authorization");
            token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
        }

        if (!token) {
            throw new Error("No autenticado");
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        return (payload as unknown as Payload).userId;
    },
}