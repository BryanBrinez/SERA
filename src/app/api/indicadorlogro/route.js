import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { IndicadorLogroSchema } from "../../types/IndicadorLogroSchema";


// Función para generar un nuevo código
const generateNewCode = async () => {
  const indicadorCollection = collection(db, "indicadoresLogro");
  const indicadorSnapshot = await getDocs(indicadorCollection);
  const indicadores = indicadorSnapshot.docs.map(doc => doc.data());

  // Extraer los códigos existentes y encontrar el último
  const existingCodes = indicadores.map(indicador => indicador.codigo);
  const maxCode = existingCodes.reduce((max, code) => {
    const num = parseInt(code.replace("IL", "")); // Convertir el código a número
    return num > max ? num : max; // Comparar para encontrar el máximo
  }, 0);

  // Generar el nuevo código con soporte para hasta 4 dígitos
  return `IL${String(maxCode + 1).padStart(4, '0')}`; // Cambiar a 4 dígitos
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
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

  if (
    !session || 
    !session.user || 
    !session.user.rol.some(role => ["Admin", "Coordinador", "Auxiliar"].includes(role))
  ) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Generar un nuevo código único para el indicador
    const nuevoCodigo = await generateNewCode();
    
    // Si es un array, procesar múltiples indicadores de logro
    if (Array.isArray(indicadorData)) {
      const results = [];

      // Iterar y crear cada indicador de logro
      for (const indicador of indicadorData) {
        // Asignar el nuevo código al indicador
        indicador.codigo = nuevoCodigo;

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
      // Asignar el nuevo código al indicador
      indicadorData.codigo = nuevoCodigo;

      // Validar el indicador usando Zod
      IndicadorLogroSchema.parse(indicadorData);

      // Crear el indicador en Firestore
      const indicadorRef = await addDoc(collection(db, "indicadoresLogro"), indicadorData);

      // Devolver la respuesta para el único indicador
      return NextResponse.json({ message: "Indicador de logro creado con éxito", id: indicadorRef.id, codigo: indicadorData.codigo});
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