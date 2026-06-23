import { NextResponse } from "next/server";
import { RegisterValidation } from "@/lib/validations";
import { userService } from "@/services/auth.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validations = RegisterValidation.safeParse(body);

        if (!validations.success) {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }

        const user = await userService.register(validations.data);

        return NextResponse.json({
            message: "Usuario creado con éxito",
            user: { name: user.name, email: user.email }
        }, { status: 201 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}