import { z } from 'zod';

export const CourseSchema = z.object({
  codigo: z.string(),
  nombre_curso: z.string(),
  Status: z.boolean(),
  Profesor: z.string(), // Asumiendo que es el ID del profesor (FK)
  ID_programa: z.string(), // Asumiendo que es el ID del programa (FK)
  creditos: z.number(),
  intensidad_horaria: z.number(),
  habilitable: z.boolean(),
  validable: z.boolean(),
  prerrequisitos: z.array(z.string()).optional(), // Asumiendo que es un array de strings para los códigos de curso
});


