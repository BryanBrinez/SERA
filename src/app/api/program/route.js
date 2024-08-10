import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);

 if (!session || !session.user || !session.user.rol.includes("Admin")) {
    console.log("MANDA EL ERROR")
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }
  
  try {
    const programCollection = collection(db, "programs");
    const programSnapshot = await getDocs(programCollection);
    const programList = programSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //console.log("User list:", userList);
    return new Response(JSON.stringify(programList), {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
