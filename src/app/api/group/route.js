import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { GroupSchema } from "../../types/GroupSchema"; 
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("GRUPOOOOOO");
  // Verificación de sesión para rol de Admin
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const groupsCollection = collection(db, "groups");
    const groupsSnapshot = await getDocs(groupsCollection);
    if (groupsSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron grupos" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    const groupsList = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(groupsList), {
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
  const groupData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar si el usuario tiene el rol de Admin
  if (!session || !session.user || !session.user.rol.includes("Admin")) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    // Validar los datos del grupo usando el esquema de Zod
    GroupSchema.parse(groupData);

    // Crear grupo en Firestore con ID automático
    const groupRef = await addDoc(collection(db, "groups"), {
        Curso: groupData.Curso,
        Profesor: groupData.Profesor,
        grupo: groupData.grupo,
        jornada: groupData.jornada,
        periodo: groupData.periodo,
        año: groupData.año,
      });

    return NextResponse.json({ message: "Grupo creado con éxito", id: groupRef.id });
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
