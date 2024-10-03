import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc  } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ResultadoAprendizajeSchema } from "../../types/ResultadoAprendizajeSchema ";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const resultadoCollection = collection(db, "resultadosAprendizaje");
    const resultadoSnapshot = await getDocs(resultadoCollection);
    if (resultadoSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron resultados de aprendizaje" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    const resultadoList = resultadoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(resultadoList), {
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
    const resultadoData = await request.json();
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }
  
    try {
      // Validar los datos usando el esquema de Zod
      ResultadoAprendizajeSchema.parse(resultadoData);
  
      // Crear el resultado de aprendizaje en Firestore
      const resultadoRef = await addDoc(collection(db, "resultadosAprendizaje"), resultadoData);
  
      return NextResponse.json({ message: "Resultado de aprendizaje creado con éxito", id: resultadoRef.id });
    } catch (error) {
      if (error.errors) {
        return NextResponse.json({ message: error.errors }, { status: 400 });
      } else {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
  }