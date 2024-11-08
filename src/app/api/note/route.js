import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, query, where  } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NotaSchema } from "../../types/NoteSchema"; 

export async function GET(req) {
  const session = await getServerSession(authOptions);

  try {
    const { searchParams } = new URL(req.url);
    const curso = searchParams.get("curso");
    const grupo = searchParams.get("grupo");
    const periodo = searchParams.get("periodo");
    const año = searchParams.get("año");

    const notasCollection = collection(db, "notas");
    let notasQuery = notasCollection;

    const queries = [];
    if (curso) {
      queries.push(where("curso", "==", curso));
    }
    if (grupo) {
      queries.push(where("grupo", "==", parseInt(grupo))); // Asegúrate de que grupo sea un número
    }
    if (periodo) {
      queries.push(where("periodo", "==", periodo)); // Asegúrate de que grupo sea un número
    }
    if (año) {
      queries.push(where("año", "==", año)); // Asegúrate de que grupo sea un número
    }
    if (queries.length > 0) {
      notasQuery = query(notasCollection, ...queries);
    }

    const notasSnapshot = await getDocs(notasQuery);
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
    console.error('Error fetching notes:', error);
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
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Verificar si notaData es un array o un solo objeto
    const notasArray = Array.isArray(notaData) ? notaData : [notaData];

    // Validar cada objeto en el array usando Zod
    notasArray.forEach((nota) => {
      NotaSchema.parse(nota);
    });

    // Crear los documentos en Firestore para cada nota
    const createdNotes = await Promise.all(notasArray.map(async (nota) => {
      const notaRef = await addDoc(collection(db, "notas"), nota);
      return { id: notaRef.id };
    }));

    // Devolver la respuesta para las nuevas notas
    return NextResponse.json({
      message: "Notas creadas con éxito",
      createdNotes,
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

