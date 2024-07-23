import { NextResponse } from "next/server";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { UserSchema } from "../../../types/UserSchema";

export async function POST(request) {
  const userData = await request.json();

  try {
    // Validar los datos del usuario usando el esquema de Zod
    UserSchema.parse(userData);

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.correo, userData.password);
    const user = userCredential.user;

    // Guardar los datos adicionales en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      codigo: userData.codigo,
      cedula: userData.cedula,
      primerNombre: userData.primerNombre,
      segundoNombre: userData.segundoNombre,
      primerApellido: userData.primerApellido,
      segundoApellido: userData.segundoApellido,
      celular: userData.celular,
      correo: userData.correo,
      rol: userData.rol,
      estado: userData.estado,
      programa_asignado: userData.programa_asignado || '', // campo opcional
      sede: userData.sede || '' // campo opcional
    });

    return NextResponse.json({ uid: user.uid, correo: user.correo });
  } catch (error) {
    console.error("Error:", error); // Registrar errores en la consola
    if (error.errors) {
      // Errores de validación de Zod
      return NextResponse.json({ message: error.errors }, { status: 400 });
    } else {
      // Otros errores (Firebase Auth)
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
