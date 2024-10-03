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
  
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }
  
    try {
      // Validar los datos usando el esquema de Zod
      IndicadorLogroSchema.parse(indicadorData);
  
      // Crear el indicador de logro en Firestore
      const indicadorRef = await addDoc(collection(db, "indicadoresLogro"), indicadorData);
  
      return NextResponse.json({ message: "Indicador de logro creado con éxito", id: indicadorRef.id });
    } catch (error) {
      if (error.errors) {
        return NextResponse.json({ message: error.errors }, { status: 400 });
      } else {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
  }