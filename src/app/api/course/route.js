import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
   if (!session || !session.user || !session.user.rol.includes("Admin")) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }

    const courseCollection = collection(db, "courses");
    const courseSnapshot = await getDocs(courseCollection);
    
    // Verifica si se obtuvieron cursos
    if (courseSnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron cursos" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    }
    
    const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(courseList), {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {


    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
