import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { sedeSchema } from "../../types/SedeSchema";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Puedes descomentar la verificación de sesión si es necesario
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const sedesCollection = collection(db, "sedes");
    const sedesSnapshot = await getDocs(sedesCollection);
    if (sedesSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron facultades" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    const sedesList = sedesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(sedesList), {
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
    const sedeData = await request.json();
  
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
  
    // Verificar si el usuario tiene el rol de Admin
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }
  
    try {
      // Validar los datos de la sede usando el esquema de Zod
      sedeSchema.parse(sedeData);
  
      // Crear sede en Firestore con ID automático
      const sedeRef = await addDoc(collection(db, "sedes"), {
        pbx: sedeData.pbx,
        celular: sedeData.celular,
        direccion: sedeData.direccion,
        ubicacion: sedeData.ubicacion,
      });
  
      return NextResponse.json({ message: "Sede creada con éxito", id: sedeRef.id });
    } catch (error) {
      if (error.errors) {
        // Errores de validación de Zod
        return NextResponse.json({ message: error.errors }, { status: 400 });
      } else {
        // Otros errores
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }
  }