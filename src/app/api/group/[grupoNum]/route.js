import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDocs, collection , updateDoc, query, where} from "firebase/firestore";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { GroupSchema } from "../../../types/GroupSchema"; // Asegúrate de que la ruta sea correcta

export async function GET(request, { params }) {
  const { grupoNum } = params;

  // Obtener los parámetros adicionales de la URL (año y periodo)
  const url = new URL(request.url);
  const año = url.searchParams.get('año');  // Año pasado como parámetro
  const periodo = url.searchParams.get('periodo');  // Periodo pasado como parámetro

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
      // Crear una referencia de consulta con where, agregando filtros dinámicos
      const groupRef = collection(db, "groups");
      let groupQuery = query(groupRef, where("grupo", "==", parseInt(grupoNum)));  // Asegurarse de que grupoNum sea un número

      // Si se proporcionaron año y periodo, agregar filtros adicionales a la misma consulta
      if (año) {
          groupQuery = query(groupQuery, where("año", "==", año));
      }
      if (periodo) {
          groupQuery = query(groupQuery, where("periodo", "==", periodo));
      }

      const groupSnapshot = await getDocs(groupQuery);

      // Verificar si no se encontraron documentos
      if (groupSnapshot.empty) {
          return new Response(
              JSON.stringify({ message: "Grupo no encontrado" }),
              { status: 404 }
          );
      }

      // Obtener los datos del primer documento que coincide
      const groupData = groupSnapshot.docs[0].data();
      return new Response(JSON.stringify(groupData));
  } catch (error) {
      return new Response(JSON.stringify({ message: error.message || "Ocurrió un error inesperado" }), {
          status: 400,
      });
  }
}


export async function PUT(request, { params }) {
  const { uid } = params; // ID del grupo a actualizar
  const updateData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar si el usuario tiene el rol de Admin
  /*if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    // Validar los datos del grupo usando Zod
    const UpdateGroupSchema = GroupSchema.partial();
    UpdateGroupSchema.parse(updateData);

    const groupRef = doc(db, "groups", uid);
    await updateDoc(groupRef, updateData);

    return new Response(JSON.stringify({ message: "Grupo actualizado correctamente" }), {
      status: 200,
    });
  } catch (error) {
    if (error.errors) {
      return new Response(JSON.stringify({ message: error.errors }), {
        status: 400,
      });
    } else {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    }
  }
}
