import { z } from "zod";

export const EvidenceSchema = z.object({
  codigo_curso: z.string(),
  grupo: z.number(),
  periodo: z.enum(["01", "02"]),
  año: z.string(),
  codigo_profesor: z.string(),
  fecha: z.string().optional(), // Cambiado a string para la fecha en formato "YYYY-MM-DD"
  hora: z.string().optional(),  // Cambiado a string para la hora en formato "00:00:00"
  nombre_evidencia: z.string(),
  descripcion: z.string(),
  archivos: z.array(z.object({ // Cambia de z.array(z.string()) a z.array(z.object({...}))
    url: z.string(),           // URL del archivo
    archivo_nombre: z.string() // Nombre del archivo
  })),
});
