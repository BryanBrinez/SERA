import { z } from "zod";

export const ContactSchema = z.object({
  pbx: z.string(),  
  celular: z.string(), 
  direccion: z.string(),  
  ubicacion: z.string(),  
});
