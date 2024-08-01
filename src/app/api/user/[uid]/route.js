
import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserSchema } from "../../../types/UserSchema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params }) {
  const { uid } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("MANDA EL ERROR")
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }



  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(userDoc.data()));
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}

export async function PUT(request, { params }) {
  const { uid } = params;
  const updateData = await request.json();

  try {
    const UpdateUserSchema = UserSchema.partial();
    UpdateUserSchema.parse(updateData); // Validar los datos usando Zod

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updateData);

    return new Response(
      JSON.stringify({ message: "Usuario actualizado correctamente" })
    );
  } catch (error) {
    if (error.errors) {
      return new Response(JSON.stringify({ message: error.errors }), {
        status: 400,
      });
    } else {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    }
  }
}
