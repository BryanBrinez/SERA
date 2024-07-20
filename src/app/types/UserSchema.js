import { z } from 'zod';

// Define el esquema para el tipo de dato "Usuario"
const UserSchema = z.object({

  nombre: z.string()
    .min(1, { message: "El nombre es obligatorio." })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres." }),
  apellido: z.string()
    .min(1, { message: "El apellido es obligatorio." })
    .max(50, { message: "El apellido no puede tener más de 50 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo electrónico válido." }),
  programa_asignado: z.string()
    .min(1, { message: "El programa asignado es obligatorio." }), // FK Programa
  tipo_identificacion: z.string()
    .min(1, { message: "El tipo de identificación es obligatorio." })
    .max(20, { message: "El tipo de identificación no puede tener más de 20 caracteres." }),
  numero_identificacion: z.string()
    .min(1, { message: "El número de identificación es obligatorio." })
    .max(20, { message: "El número de identificación no puede tener más de 20 caracteres." }),
  codigo: z.string()
    .min(1, { message: "El código es obligatorio." })
    .max(10, { message: "El código no puede tener más de 10 caracteres." }),
  rol: z.string()
    .min(1, { message: "El rol es obligatorio." }), 
  sede: z.string()
    .min(1, { message: "La sede es obligatoria." })
    .max(50, { message: "La sede no puede tener más de 50 caracteres." }),
  tel: z.string()
    .min(1, { message: "El teléfono es obligatorio." })
    .max(15, { message: "El teléfono no puede tener más de 15 caracteres." })
    .regex(/^\d+$/, { message: "El teléfono debe contener solo números." }),
});

export { UserSchema };
