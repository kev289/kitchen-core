import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

type JWTPayload = {
    userId: string;
    email: string;
    name: string;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const authLib = {
    hashPassword: (password: string) => bcrypt.hash(password, 10),
    comparePassword: (password: string, hash: string) => bcrypt.compare(password, hash),

    generateAccessToken: async ({userId, name, email}: JWTPayload) => {
        return await new SignJWT({ userId, name, email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("15m")
        .sign(JWT_SECRET);
    },

    generateRefreshToken: async ({userId, name, email}: JWTPayload) => {
        return await new SignJWT({ userId, name, email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
    },

    verifyAccessToken: async (token: string) => {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    },
}