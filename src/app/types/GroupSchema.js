import { z } from "zod";

export const GroupSchema = z.object({
  Curso: z.string(),
  Profesor: z.string(),
  grupo: z.number().int(),
  jornada: z.enum(["Diurna", "Nocturna"]),
  periodo: z.enum(["01", "02"]),
  año: z.string(),
});

//750090M-50-2024-01
