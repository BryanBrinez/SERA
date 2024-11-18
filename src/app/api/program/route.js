import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (
    !session || 
    !session.user || 
    !session.user.rol.some(role => ["Admin", "Coordinador", "Auxiliar", "Profesor"].includes(role))
  ) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const { rol, id: userId, email } = session.user;

    const userRef = collection(db, "users");
    const userQuery = query(userRef, where("correo", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    let programSnapshot;
    if (rol.includes("Admin")) {
      const programCollection = collection(db, "programs");
      programSnapshot = await getDocs(programCollection);

      if (programSnapshot.empty) {
        return new Response(JSON.stringify({ message: "No se encontraron programas" }), {
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        });
      }
    } else if (rol.includes("Coordinador")) {
      const userData = userSnapshot.docs[0].data();

      const programRef = collection(db, "programs");
      const programQuery = query(programRef, where("ID_coordinador", "==", userData.cedula));
      programSnapshot = await getDocs(programQuery);

      if (programSnapshot.empty) {
        return new Response(JSON.stringify({ message: "No se encontraron programas para el coordinador" }), {
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        });
      }
    }

    const programList = programSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(programList), {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
