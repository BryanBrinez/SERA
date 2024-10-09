import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, query, orderBy, limit } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

import { ResultadoAprendizajeSchema } from "../../types/ResultadoAprendizajeSchema ";

// Función para generar un nuevo código
const generateNewCode = async () => {
  const resultadoCollection = collection(db, "resultadosAprendizaje");
  const resultadoSnapshot = await getDocs(resultadoCollection);
  const resultados = resultadoSnapshot.docs.map(doc => doc.data());
  
  // Extraer los códigos existentes y encontrar el último
  const existingCodes = resultados.map(result => result.codigo);
  const maxCode = existingCodes.reduce((max, code) => {
    const num = parseInt(code.replace("RA", ""));
    return num > max ? num : max;
  }, 0);
  
  // Generar el nuevo código
  return `RA${String(maxCode + 1).padStart(4, '0')}`;
};

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
    // Generar un nuevo código para el resultado de aprendizaje
    const nuevoCodigo = await generateNewCode();

    // Crear el objeto de resultado de aprendizaje con el nuevo código
    const resultadoConCodigo = {
      ...resultadoData,
      codigo: nuevoCodigo // Asignar el nuevo código generado
    };

    // Validar el resultado usando Zod
    ResultadoAprendizajeSchema.parse(resultadoConCodigo);

    // Crear el resultado en Firestore
    const resultadoRef = await addDoc(collection(db, "resultadosAprendizaje"), resultadoConCodigo);

    // Devolver la respuesta
    return NextResponse.json({
      message: "Resultado de aprendizaje creado con éxito",
      id: resultadoRef.id,
      codigo: nuevoCodigo // Retornar el código generado
    });

  } catch (error) {
    if (error.errors) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
