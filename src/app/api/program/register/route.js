import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { addDoc, query, where, getDocs, collection } from "firebase/firestore";
import { ProgramSchema } from "../../../types/ProgramSchema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ajusta la ruta según tu configuración

export async function POST(request) {
  const programaData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  if (
    !session || 
    !session.user || 
    !session.user.rol.some(role => ["Admin"].includes(role))
  ) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Validar los datos del programa usando el esquema de Zod
    ProgramSchema.parse(programaData);


    // Consulta por cédula
    const programRef = collection(db, "programs");
    const programQuery = query(programRef, where("codigo", "==", programaData.codigo));
    const programSnapshot = await getDocs(programQuery);

    if (!programSnapshot.empty) {
      return NextResponse.json({ message: "El codigo ya está registrado." }, { status: 400 });
    }

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
