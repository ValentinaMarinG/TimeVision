import { z } from "zod";

export const LoginSchema = z.object({
  user: z
    .string({ required_error: "El correo es requerido." })
    .email({ message: "El correo no es válido." })
    .min(5, { message: "Debe tener al menos 5 caracteres." })
    .max(50, { message: "No debe tener más de 50 caracteres." }),
  pass: z
    .string({ required_error: "La contraseña es requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }) 
    .max(64, { message: "La contraseña no debe tener más de 64 caracteres." })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula." })
    .regex(/\d/, { message: "La contraseña debe contener al menos un número." }) 
    .regex(/[\W_]/, { message: "La contraseña debe contener al menos un carácter especial." })
    .regex(/^[^\ñÑ]*$/, { message: "La contraseña no debe contener la letra 'ñ'." }),  
});
