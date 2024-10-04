import { z } from 'zod';

export const ResultadoAprendizajeSchema = z.object({
  codigo: z.string(),
  nombre_resultado: z.string(),
  descripcion: z.string(),
  codigo_curso: z.string(), // Hace referencia al curso asociado
});
