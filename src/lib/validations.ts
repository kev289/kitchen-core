import z from "zod";

export const RegisterValidation = z.object({
    name: z.string().min(2, "Nombre muy corto."),
    email: z.string().email("Email invalido."),
    password: z.string().min(8, "Minimo 8 caracteres.")
})

export const LoginValidation = z.object({
    email: z.string().email("Email invalido"),
    password: z.string(). min(1, "La contraseña es obligatoria.")
})
