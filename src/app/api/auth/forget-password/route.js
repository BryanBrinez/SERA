import { NextResponse } from "next/server";
import { auth } from "../../firebase/config"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "El correo es obligatorio" }, { status: 400 });
    }


    // Enviar correo de recuperación
    await sendPasswordResetEmail(auth, email);

    return NextResponse.json({
      message: "Correo de recuperación enviado. Verifica tu bandeja de entrada.",
    });
  } catch (error) {
    let errorMessage = "Error al procesar la solicitud.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No existe un usuario registrado con ese correo.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "El correo ingresado no es válido.";
    }

    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}
