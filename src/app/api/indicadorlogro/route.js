import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc  } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { IndicadorLogroSchema } from "../../types/IndicadorLogroSchema";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const indicadorCollection = collection(db, "indicadoresLogro");
    const indicadorSnapshot = await getDocs(indicadorCollection);
    if (indicadorSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron indicadores de logro" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    const indicadorList = indicadorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(indicadorList), {
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
  const indicadorData = await request.json();
  const session = await getServerSession(authOptions);

 /* if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    // Si es un array, procesar múltiples indicadores de logro
    if (Array.isArray(indicadorData)) {
      const results = [];

      // Iterar y crear cada indicador de logro
      for (const indicador of indicadorData) {
        // Validar cada indicador usando Zod
        IndicadorLogroSchema.parse(indicador);

        // Crear el indicador en Firestore
        const indicadorRef = await addDoc(collection(db, "indicadoresLogro"), indicador);

        // Agregar el resultado al array
        results.push({ message: "Indicador de logro creado con éxito", id: indicadorRef.id });
      }

      // Devolver la respuesta con los resultados
      return NextResponse.json(results);
    } else {
      // Si es un solo objeto, crear un único indicador de logro
      // Validar el indicador usando Zod
      IndicadorLogroSchema.parse(indicadorData);

      // Crear el indicador en Firestore
      const indicadorRef = await addDoc(collection(db, "indicadoresLogro"), indicadorData);

      // Devolver la respuesta para el único indicador
      return NextResponse.json({ message: "Indicador de logro creado con éxito", id: indicadorRef.id });
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