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

export const RecipeValidation = z.object({
  name: z.string().min(3, "El nombre es muy corto."),
  image: z.string().url("Debe ser una URL válida."),
  preparationTime: z.number().positive("El tiempo debe ser mayor a 0."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  ingredients: z.array(z.string()).min(1, "Debes incluir al menos un ingrediente."),
  steps: z.array(z.string()).min(1, "Debes incluir al menos un paso."),
  servings: z.number().int().positive("La cantidad de porciones debe ser válida."),
});