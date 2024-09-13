import { z } from "zod";

export const sedeSchema = z.object({
  pbx: z.string(),  
  celular: z.string(), 
  direccion: z.string(),  
  ubicacion: z.string(),  
});
