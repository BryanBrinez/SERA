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

  /*if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    // Si el cuerpo es un array, procesar múltiples resultados de aprendizaje
    if (Array.isArray(resultadoData)) {
      const results = [];

      // Iterar y crear cada resultado de aprendizaje
      for (const resultado of resultadoData) {
        // Validar cada resultado de aprendizaje usando Zod
        ResultadoAprendizajeSchema.parse(resultado);

        // Crear el resultado en Firestore
        const resultadoRef = await addDoc(collection(db, "resultadosAprendizaje"), resultado);

        // Agregar el resultado al array
        results.push({
          message: "Resultado de aprendizaje creado con éxito",
          id: resultadoRef.id,
        });
      }

      // Devolver la respuesta con los resultados
      return NextResponse.json(results);
    } else {
      // Si es un solo objeto, crear un único resultado de aprendizaje
      // Validar el resultado usando Zod
      ResultadoAprendizajeSchema.parse(resultadoData);

      // Crear el resultado en Firestore
      const resultadoRef = await addDoc(collection(db, "resultadosAprendizaje"), resultadoData);

      // Devolver la respuesta para el único resultado
      return NextResponse.json({
        message: "Resultado de aprendizaje creado con éxito",
        id: resultadoRef.id,
      });
    }
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