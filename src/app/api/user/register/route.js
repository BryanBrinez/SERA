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
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;

    // Guardar los datos adicionales en Firestore
    
    await setDoc(doc(db, 'users', user.uid), {
      
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      programa_asignado: userData.programa_asignado,
      tipo_identificacion: userData.tipo_identificacion,
      numero_identificacion: userData.numero_identificacion,
      codigo: userData.codigo,
      rol: userData.rol,
      sede: userData.sede,
      tel: userData.tel,
    });

    return NextResponse.json({ uid: user.uid, email: user.email });
  } catch (error) {
    if (error.errors) {
      // Errores de validación de Zod
      return NextResponse.json({ message: error.errors }, { status: 400 });
    } else {
      // Otros errores (Firebase Auth)
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}