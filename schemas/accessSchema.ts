import { z } from "zod";

export const AccessSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido." })
    .email({ message: "El correo no es válido." })
    .min(5, { message: "Debe tener al menos 5 caracteres." })
    .max(50, { message: "No debe tener más de 50 caracteres." }),
});