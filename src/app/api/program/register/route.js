import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { ProgramSchema } from "../../../types/ProgramSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ajusta la ruta según tu configuración

export async function POST(request) {
  const programaData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar si el usuario tiene el rol de Admin
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Validar los datos del programa usando el esquema de Zod
    ProgramSchema.parse(programaData);

    // Crear programa en Firestore con ID automático
    const programaRef = await addDoc(collection(db, "programs"), {
      ID_coordinador: programaData.ID_coordinador,
      nombre_programa: programaData.nombre_programa,
      codigo: programaData.codigo,
      facultad: programaData.facultad,
      duracion: programaData.duracion,
      periodicidad_de_admisiones: programaData.periodicidad_de_admisiones,
      modalidad: programaData.modalidad,
      jornada: programaData.jornada,
      creditos: programaData.creditos,
      registro_ICFES: programaData.registro_ICFES,
      registro_SNIES: programaData.registro_SNIES,
      resolucion_MEN: programaData.resolucion_MEN,
      resolucion_del_PENSUM: programaData.resolucion_del_PENSUM,
      fecha_dec_creacion: programaData.fecha_dec_creacion,
      sede: programaData.sede,
      email: programaData.email
    });

    return NextResponse.json({ message: "Programa creado con éxito", id: programaRef.id });
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
