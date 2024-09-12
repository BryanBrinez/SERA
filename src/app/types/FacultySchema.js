import { z } from "zod";

export const FacultySchema = z.object({
  decano: z.string(),  // Para el nombre del decano
  email: z.string().email(),  // Para validar el correo electrónico
  nombre: z.string(),  // El nombre de la facultad, como "Ingeniería"
  telefono: z.string(),  // El teléfono con extensión
  web: z.string().url(),  // Para validar la URL de la página web
});
