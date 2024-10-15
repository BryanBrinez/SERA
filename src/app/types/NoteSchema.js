import { z } from 'zod';

export const NotaSchema = z.object({
  curso: z.string(),
  grupo: z.number(),
  codigo_resultados: z.record(z.array(z.string())), // Cambia a z.record() para aceptar un objeto dinámico
  estudiantes: z.array(z.object({
    nombre: z.string(),
    codigo: z.string(),
    notas: z.array(z.object({
      nombre_nota: z.string(),
      codigos_indicadores: z.array(z.string()),
      calificacion: z.number(),
      porcentaje: z.number()
    }))
  }))
});
