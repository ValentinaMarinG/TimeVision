import { z } from "zod";

const currentYear = new Date().getFullYear();

export const RequestSchema = z
  .object({
    type: z.string({ required_error: "El tipo de solicitud es requerido." }),
    title: z
      .string({ required_error: "El titulo es requerido." })
      .max(50, { message: "No debe tener más de 50 caracteres." }),
    start_date: z
      .date({ required_error: "La fecha de inicio es requerida." })
      .refine((date) => date.getFullYear() >= currentYear, {
        message: "La fecha no puede ser de años anteriores.",
      }),
    end_date: z
      .date({
        required_error: "La fecha de finalización es requerida.",
      })
      .refine((date) => date.getFullYear() >= currentYear, {
        message: "La fecha no puede ser de años anteriores.",
      }),
    description: z
      .string({ required_error: "La descripción es requerida." })
      .max(500, { message: "No debe tener más de 500 caracteres." }),
  })
  .refine((data) => data.start_date <= data.end_date, {
    message:
      "La fecha de inicio no puede ser mayor a la fecha de finalización.",
    path: ["end_date"],
  });
