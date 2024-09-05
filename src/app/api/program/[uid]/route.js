import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ProgramSchema } from "../../../types/ProgramSchema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params }) {
  const { uid } = params;

  if (!uid) {
    return NextResponse.json({ message: "ID de programa inválido" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const programaRef = doc(db, "programs", uid);
    const programaDoc = await getDoc(programaRef);

    if (!programaDoc.exists()) {
      return new Response(JSON.stringify({ message: "Programa no encontrado" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(programaDoc.data()));
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error al obtener el programa", detalle: error.message }), {
      status: 500,
    });
  }
}


export async function PUT(request, { params }) {
  const { uid } = params;
  const updateData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Validar los datos del programa usando el esquema parcial de Zod
    const UpdateProgramaSchema = ProgramSchema.partial();
    UpdateProgramaSchema.parse(updateData);

    const programaRef = doc(db, "programs", uid);
    await updateDoc(programaRef, updateData);

    return new Response(
      JSON.stringify({ message: "Programa actualizado correctamente" })
    );
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
