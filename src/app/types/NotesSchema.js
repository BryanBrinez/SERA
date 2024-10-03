import { z } from 'zod';

export const NotesSchema = z.object({
    grupo: z.number().int()
  
});
