import { z } from "zod";

export const createChangePasswordSchema = (currentPassword:String) =>
  z.object({
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
      .refine((val) => !val.includes("ñ"), {
        message: "La contraseña no puede contener la letra 'ñ'.",
      })
      .refine((val) => val !== currentPassword, {
        message: "Contraseña usada recientemente.",
      })
      .refine((val) => /\d/.test(val), {
        message: "La contraseña debe contener al menos un número.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "La contraseña debe contener al menos una letra mayúscula.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "La contraseña debe contener al menos un carácter especial.",
      }),
  });
