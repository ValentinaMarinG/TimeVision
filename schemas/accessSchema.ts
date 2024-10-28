import { z } from "zod";

export const AccessSchema = z.object({
  email: z
    .string({ required_error: "El correo es requerido." })
    .email({ message: "El correo no es válido." })
    .min(5, { message: "El correo no es válido." })
    .max(50, { message: "El correo no es válido." }),
});