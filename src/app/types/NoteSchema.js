import { z } from 'zod';

export const NotaSchema = z.object({
  curso: z.string(), // Nombre o código del curso
  grupo: z.string(), // Nombre o código del grupo,
  estudiantes: z.array(
    z.object({
      nombre: z.string(), // Nombre del estudiante
      notas: z.array(
        z.object({
          nombre_nota: z.string(), // Nombre de la evaluación
          codigos_indicadores: z.array(z.string()), // Array de códigos de indicadores
          calificacion: z.number(), // Nota del estudiante
          porcentaje: z.number(),
        })
      )
    })
  )
});
