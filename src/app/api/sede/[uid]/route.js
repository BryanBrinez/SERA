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

  if (
    !session || 
    !session.user || 
    !session.user.rol.some(role => ["Admin", "Coordinador", "Auxiliar", "Profesor"].includes(role))
  ) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const sedeRef = doc(db, "sedes", uid);
    const sedeDoc = await getDoc(sedeRef);

    if (!sedeDoc.exists()) {
      return new Response(JSON.stringify({ message: "Sede no encontrada" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(sedeDoc.data()), {
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
  
    // Verificar si el usuario tiene el rol de Admin
    if (
      !session || 
      !session.user || 
      !session.user.rol.some(role => ["Admin"].includes(role))
    ) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }
  
    try {
      // Validar los datos de la sede usando Zod
      const UpdateSedeSchema = sedeSchema.partial();
      UpdateSedeSchema.parse(updateData);
  
      const sedeRef = doc(db, "sedes", uid);
      await updateDoc(sedeRef, updateData);
  
      return new Response(JSON.stringify({ message: "Sede actualizada correctamente" }), {
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