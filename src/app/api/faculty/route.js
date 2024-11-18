import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FacultySchema } from "../../types/FacultySchema";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Puedes descomentar la verificación de sesión si es necesario
  if (!session || !session.user) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const facultyCollection = collection(db, "faculties");
    const facultySnapshot = await getDocs(facultyCollection);
    if (facultySnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron facultades" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    const facultyList = facultySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(facultyList), {
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
    const facultyData = await request.json();
  
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
  
    // Verificar si el usuario tiene el rol de Admin
    if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }
  
    try {
      // Validar los datos de la facultad usando el esquema de Zod
      FacultySchema.parse(facultyData);
  
      // Crear facultad en Firestore con ID automático
      const facultyRef = await addDoc(collection(db, "faculties"), {
        decano: facultyData.decano,
        email: facultyData.email,
        nombre: facultyData.nombre,
        telefono: facultyData.telefono,
        web: facultyData.web,
        pbx: facultyData.pbx,
        celular: facultyData.celular,
        direccion: facultyData.direccion,
        ubicacion: facultyData.ubicacion
      });
  
      return NextResponse.json({ message: "Facultad creada con éxito", id: facultyRef.id });
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