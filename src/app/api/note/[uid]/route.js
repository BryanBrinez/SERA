import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc  } from "firebase/firestore";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { sedeSchema } from "../../../types/SedeSchema"; 

export async function GET(request, { params }) {
    const { uid } = params; // ID de la sede
  
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
  
    /*// Verificar si el usuario tiene el rol de Admin
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }*/
  
    try {
      const notasRef = doc(db, "notas", uid);
      const notaDoc = await getDoc(notasRef);
  
      if (!notaDoc.exists()) {
        return new Response(JSON.stringify({ message: "Sede no encontrada" }), {
          status: 404,
        });
      }
  
      return new Response(JSON.stringify(notaDoc.data()), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message || "Ocurrió un error inesperado" }), {
        status: 400,
      });
    }
  }

export async function PUT(request, { params }) {
    const { uid } = params; // ID de la sede a actualizar
    const updateData = await request.json();
  
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
  
   /* // Verificar si el usuario tiene el rol de Admin
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }*/
  
    try {
      // Validar los datos de la sede usando Zod
      const UpdateNotaSchema = sedeSchema.partial();
      UpdateNotaSchema.parse(updateData);
  
      const notaRef = doc(db, "notas", uid);
      await updateDoc(notaRef, updateData);
  
      return new Response(JSON.stringify({ message: "Nota actualizada correctamente" }), {
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