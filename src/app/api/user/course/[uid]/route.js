import { NextResponse } from "next/server";
import { db } from "../../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params }) {
  const { uid } = params;

  if (!uid) {
    return new Response(JSON.stringify({ message: "Cédula no proporcionada" }), { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    const coursesCollection = collection(db, "courses");
    const q = query(coursesCollection, where("id", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response(JSON.stringify({ message: "No se encontraron cursos para esta cédula" }), { status: 404 });
    }

    const courses = querySnapshot.docs.map((doc) => doc.data());

    return new Response(JSON.stringify(courses));
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
