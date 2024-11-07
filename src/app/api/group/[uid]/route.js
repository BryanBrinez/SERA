import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { GroupSchema } from "../../../types/GroupSchema"; // Asegúrate de que la ruta sea correcta

export async function GET(request, { params }) {
  const { uid } = params; // ID del grupo

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar si el usuario tiene el rol de Admin
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const groupRef = doc(db, "groups", uid);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      return new Response(JSON.stringify({ message: "Grupo no encontrado" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(groupDoc.data()), {
      status: 200,
    });
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
