import { z } from 'zod';

export const CourseSchema = z.object({
  codigo: z.string(),
  nombre_curso: z.string(),
  estado: z.enum(['Activo', 'Inactivo']),
  Profesor: z.string(),
  codigo_programa: z.string(),
  creditos: z.number().int().positive(),
  grupo: z.number().int(),
  jornada: z.enum(['Diurna', 'Nocturna']),
  intensidad_horaria: z.number().int().positive(),
  habilitable: z.enum(['Si', 'No']),
  validable: z.enum(['Si', 'No']),
  prerrequisitos: z.array(z.string()).optional()
});
