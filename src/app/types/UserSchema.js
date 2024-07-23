import { z } from 'zod';

// Define el esquema para el tipo de dato "Usuario"
const UserSchema = z.object({
  codigo: z.string()
    .min(1, { message: "El código es obligatorio." })
    .max(10, { message: "El código no puede tener más de 10 caracteres." }),
  cedula: z.string()
    .min(1, { message: "La cédula es obligatoria." })
    .max(20, { message: "La cédula no puede tener más de 20 caracteres." }),
  primerNombre: z.string()
    .min(1, { message: "El primer nombre es obligatorio." })
    .max(50, { message: "El primer nombre no puede tener más de 50 caracteres." }),
  segundoNombre: z.string()
    .max(50, { message: "El segundo nombre no puede tener más de 50 caracteres." })
    .optional(),
  primerApellido: z.string()
    .min(1, { message: "El primer apellido es obligatorio." })
    .max(50, { message: "El primer apellido no puede tener más de 50 caracteres." }),
  segundoApellido: z.string()
    .max(50, { message: "El segundo apellido no puede tener más de 50 caracteres." })
    .optional(),
  celular: z.string()
    .min(1, { message: "El celular es obligatorio." })
    .max(15, { message: "El celular no puede tener más de 15 caracteres." })
    .regex(/^\d+$/, { message: "El celular debe contener solo números." }),
  correo: z.string().email({ message: "Debe ser un correo electrónico válido." }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  rol: z.array(z.string())
    .min(1, { message: "El rol es obligatorio." }), 
  estado: z.string()
    .min(1, { message: "El estado es obligatorio." }),
  programa_asignado: z.string()
    .max(50, { message: "El programa asignado no puede tener más de 50 caracteres." })
    .optional(),
  sede: z.string()
    .max(50, { message: "La sede no puede tener más de 50 caracteres." })
    .optional(),
});

export { UserSchema };
