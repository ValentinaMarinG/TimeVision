import { z } from "zod";

const currentYear = new Date().getFullYear();

export const RequestSchema = z
  .object({
    type: z.string({ required_error: "El tipo de solicitud es requerido." }),
    title: z
      .string({ required_error: "El título es requerido." })
      .max(50, { message: "No debe tener más de 50 caracteres." }),
    start_date: z
      .date({ required_error: "La fecha es requerida." })
      .refine((date) => date.getFullYear() >= currentYear, {
        message: "La fecha no puede ser de años anteriores.",
      }),
    end_date: z
      .date()
      .optional()
      .refine((date) => {
        if (!date) return true;
        return date.getFullYear() >= currentYear;
      }, {
        message: "La fecha de finalización no puede ser de años anteriores.",
      }),
    description: z
      .string({ required_error: "La descripción es requerida." })
      .max(500, { message: "No debe tener más de 500 caracteres." }),
  })
  .refine((data) => {
    if (data.type != "Cambio de turno" && !data.end_date) {
      return false;
    }
    return true;
  }, {
    message: "La fecha de finalización es obligatoria para este tipo de solicitud.",
    path: ["end_date"],
  })
  .refine((data) => {
    if (data.end_date) {
      return data.start_date <= data.end_date;
    }
    return true;
  }, {
    message: "La fecha de inicio no puede ser mayor a la fecha de finalización.",
    path: ["end_date"],
  });
