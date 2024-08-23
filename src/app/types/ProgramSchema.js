import { z } from "zod";

export const ProgramSchema = z.object({
  ID_coordinador: z.string(),
  nombre_programa: z.string(),
  facultad: z.string(),
  duracion: z.number(),
  periodicidad_de_admisiones: z.string(),
  modalidad: z.string(),
  jornada: z.string(),
  creditos: z.string(),
  registro_ICFES: z.string(),
  registro_SNIES: z.string(),
  resolucion_MEN: z.string(),
  resolucion_del_PENSUM: z.string(),
  fecha_dec_creacion: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  sede: z.string(),
  email: z.string().email()
});
