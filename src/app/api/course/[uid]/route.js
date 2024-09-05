import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CourseSchema } from "../../../types/CourseSchema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params }) {
  const { uid } = params;

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);
 /* if (!session) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    const courseRef = doc(db, "courses", uid);
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      return new Response(
        JSON.stringify({ message: "Programa no encontrado" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(courseDoc.data()));
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "Ocurrió un error inesperado"}), {
      status: 400,
    });
  }
}

export async function PUT(request, { params }) {
  const { uid } = params;
  const updateData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);
  /*if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    // Validar los datos del programa usando el esquema parcial de Zod
    const UpdateCourseSchema = CourseSchema.partial();
    UpdateCourseSchema.parse(updateData);

    const courseRef = doc(db, "courses", uid);
    await updateDoc(courseRef, updateData);

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
