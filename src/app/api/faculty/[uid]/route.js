import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc  } from "firebase/firestore";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { FacultySchema } from "../../../types/FacultySchema";

export async function GET(request, { params }) {
  const { uid } = params; // ID de la facultad

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Si quieres verificar la sesión y rol de Admin, puedes descomentar esto
  
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
  

  try {
    const facultyRef = doc(db, "faculties", uid);
    const facultyDoc = await getDoc(facultyRef);

    if (!facultyDoc.exists()) {
      return new Response(JSON.stringify({ message: "Facultad no encontrada" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(facultyDoc.data()), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message || "Ocurrió un error inesperado" }), {
      status: 400,
    });
  }
}


export async function PUT(request, { params }) {
    const { uid } = params; // ID de la facultad a actualizar
    const updateData = await request.json();
  
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
  
    // Si quieres verificar la sesión y rol de Admin, puedes descomentar esto
    
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }
    
  
    try {
      // Validar los datos de la facultad usando Zod
      const UpdateFacultySchema = FacultySchema.partial();
      UpdateFacultySchema.parse(updateData);
  
      const facultyRef = doc(db, "faculties", uid);
      await updateDoc(facultyRef, updateData);
  
      return new Response(JSON.stringify({ message: "Facultad actualizada correctamente" }), {
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