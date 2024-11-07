import { NextResponse } from "next/server";
import { db } from "../../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params }) {
  const { courseCode } = params; // Código del curso

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar si el usuario tiene el rol de Admin
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Crear una consulta a Firestore para obtener grupos con el curso especificado
    const groupsCollection = collection(db, "groups");
    const groupsQuery = query(groupsCollection, where("Curso", "==", courseCode));
    const groupsSnapshot = await getDocs(groupsQuery);

    if (groupsSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron grupos para este curso" }), {
        status: 404,
      });
    }

    // Mapear los documentos encontrados a una lista de objetos
    const groupsList = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(groupsList), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "Ocurrió un error inesperado" }), {
      status: 400,
    });
  }
}
