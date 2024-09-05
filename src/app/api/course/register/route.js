import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { CourseSchema } from "../../../types/CourseSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ajusta la ruta según tu configuración

export async function POST(request) {
  const cursoData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar si el usuario tiene el rol de Admin (descomentado si se necesita)
  // if (!session || !session.user || !session.user.rol.includes("Admin")) {
  //   return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  // }

  try {
    // Validar los datos del curso usando el esquema de Zod
    CourseSchema.parse(cursoData);

    // Crear curso en Firestore con ID automático
    const cursoRef = await addDoc(collection(db, "courses"), {
      codigo: cursoData.codigo,
      nombre_curso: cursoData.nombre_curso,
      estado: cursoData.estado, // Asegúrate de usar el nombre correcto del campo
      Profesor: cursoData.Profesor,
      codigo_programa: cursoData.codigo_programa,
      creditos: cursoData.creditos,
      intensidad_horaria: cursoData.intensidad_horaria,
      habilitable: cursoData.habilitable,
      validable: cursoData.validable,
      prerrequisitos: cursoData.prerrequisitos,
      grupo: cursoData.grupo,
      jornada: cursoData.jornada,

    });

    return NextResponse.json({ message: "Curso creado con éxito", id: cursoRef.id });
  } catch (error) {
    if (error.errors) {
      // Errores de validación de Zod
      return NextResponse.json({ message: error.errors }, { status: 400 });
    } else {
      // Otros errores
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
