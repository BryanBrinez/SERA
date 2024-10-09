import { NextResponse } from "next/server";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, query, where, getDocs, collection } from "firebase/firestore";
import { UserSchema } from "../../../types/UserSchema";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route" // Ajusta la ruta según tu configuración

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "hotmail", // Puedes usar cualquier servicio de correo
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  const userData = await request.json();

  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  

  /*if (!session || !session.user || !session.user.rol.includes("Admin")) {
    console.log("MANDA EL ERROR")
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

  try {
    // Validar los datos del usuario usando el esquema de Zod
    UserSchema.parse(userData);



   
    // Consulta por cédula
    const usersRef = collection(db, "users");
    const cedulaQuery = query(usersRef, where("cedula", "==", userData.cedula));
    const cedulaSnapshot = await getDocs(cedulaQuery);

    if (!cedulaSnapshot.empty) {
      return NextResponse.json({ message: "La cédula ya está registrada." }, { status: 400 });
    }

    // Asignar la cédula como contraseña
    const password = userData.cedula; 


    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.correo,
      password
    );
    const user = userCredential.user;

    // Guardar los datos adicionales en Firestore
    await setDoc(doc(db, "users", user.uid), {
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
      programa_asignado: userData.programa_asignado || [], // campo opcional como array
      sede: userData.sede || [], // campo opcional como array
    });

    // Enviar correo de bienvenida
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.correo,
      subject: "Cuenta creada con éxito",
      text: `Hola ${userData.primerNombre},\n\nTu cuenta ha sido creada exitosamente. \n\nCorreo: ${userData.correo}\nContraseña: ${userData.password}\n\nGracias por registrarte.\n\nSaludos, \nEl equipo`,
    };

    await transporter.sendMail(mailOptions);

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
