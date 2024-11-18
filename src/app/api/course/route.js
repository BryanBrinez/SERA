import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET() {

  try {
    const session = await getServerSession(authOptions);

    // Verificar si el usuario tiene el rol de Admin (descomentado si se necesita)
    if (
      !session || 
      !session.user || 
      !session.user.rol.some(role => ["Admin", "Coordinador", "Auxiliar"].includes(role))
    ) {
      return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    const { rol, id: userId, email } = session.user;

    const userRef = collection(db, "users");
    const userQuery = query(userRef, where("correo", "==", email));
    const userSnapshot = await getDocs(userQuery);

    console.log("USER ID", userId);



    // const programRef = collection(db, "programs");
    // const programQuery = query(programRef, where("ID_coordinador", "==", userId));
    // const programSnapshot = await getDocs(programQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();

      console.log(userData);

      const programaAsignado = userData.programa_asignado;
      console.log(programaAsignado);

    } else {
      console.log("No se encontró el usuario con ese ID");
    }

    let courseCollection = collection(db, "courses");
    let courseQuery;

    if (rol.includes("Admin")) {
      // Si es Admin, obtiene todos los cursos sin filtrar
      courseQuery = courseCollection;
    } else if (rol.includes("Coordinador")) {

      const userData = userSnapshot.docs[0].data();

      const programRef = collection(db, "programs");
      const programQuery = query(programRef, where("ID_coordinador", "==", userData.cedula));
      const programSnapshot = await getDocs(programQuery);

      const programData = programSnapshot.docs[0].data();

      console.log(" CODIGO PROGRAMMA", programData.codigo)

      console.log("TIPO CODIGO PROGRAMA", typeof (programData.codigo))

      courseQuery = query(
        courseCollection,
        where("codigo_programa", "==", programData.codigo)
      );
    } else {
      return NextResponse.json(
        { message: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
      return new Response(
        JSON.stringify({ message: "No se encontraron cursos" }),
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const courseList = courseSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(courseList), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
