import { z } from "zod";

export const LoginSchema = z.object({
  user: z
    .string({ required_error: "El correo es requerido" })
    .email({ message: "El correo no es válido" })
    .min(5, { message: "El correo no es válido" })
    .max(50, { message: "El correo no es válido" }),
  pass: z
    .string({ required_error: "La contraseña es requerida" })
      .max(64, { message: "La contraseña no debe tener más de 64 caracteres" })
    /* .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }) 
    .regex(/^[^\ñÑ]*$/, { message: "La contraseña no debe contener la letra 'ñ'" })
    .refine(value => !/\s/.test(value), { message: "La contaseña no puede contener espacios" })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
    .regex(/\d/, { message: "La contraseña debe contener al menos un número" }) 
    .regex(/[\W_]/, { message: "La contraseña debe contener al menos un carácter especial" })
    .regex(/^[^\ñÑ]*$/, { message: "La contraseña no debe contener la letra 'ñ'" }),   */
});
