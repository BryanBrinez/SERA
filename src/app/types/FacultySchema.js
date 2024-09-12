import { z } from "zod";

export const FacultySchema = z.object({
  decano: z.string(),  
  email: z.string().email(),  
  nombre: z.string(),  
  telefono: z.string(), 
  web: z.string().url(),  
});
