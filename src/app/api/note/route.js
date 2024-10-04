import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NotaSchema } from "../../types/NoteSchema"; 

export async function GET() {
  const session = await getServerSession(authOptions);

  // Comprobar si la sesión es válida y si el usuario tiene rol de Admin
  /*if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    const notasCollection = collection(db, "notas");
    const notasSnapshot = await getDocs(notasCollection);
    if (notasSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron notas" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    const notasList = notasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(notasList), {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}

export async function POST(request) {
  const notaData = await request.json();
  const session = await getServerSession(authOptions);

  // Comprobar si la sesión es válida y si el usuario tiene rol de Admin
  /*if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
*/
  try {
    // Validar los datos de las notas usando Zod
    NotaSchema.parse(notaData);

    // Crear el documento en Firestore
    const notaRef = await addDoc(collection(db, "notas"), notaData);

    // Devolver la respuesta para la nueva nota
    return NextResponse.json({
      message: "Notas creadas con éxito",
      id: notaRef.id,
    });
  } catch (error) {
    if (error.errors) {
      // Manejar errores de validación de Zod
      return NextResponse.json({ message: error.errors }, { status: 400 });
    } else {
      // Manejar otros errores
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
