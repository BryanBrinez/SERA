import { z } from 'zod';

export const IndicadorLogroSchema = z.object({
  codigo: z.string(),
  nombre_indicador: z.string(),
  descripcion: z.string(),
  codigo_resultado_aprendizaje: z.string(), // Hace referencia al resultado de aprendizaje
});
