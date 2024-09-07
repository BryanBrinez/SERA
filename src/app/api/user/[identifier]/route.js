import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { collection, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { UserSchema } from "../../../types/UserSchema";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { getAuth } from 'firebase-admin/auth'; 
import admin from "../../firebase/configAdmin";

export async function GET(request, { params }) {
  const { identifier } = params; // Obtiene el identificador de la ruta dinámica
  const searchBy = request.nextUrl.searchParams.get('searchBy'); // Obtiene el parámetro de consulta 'searchBy'

  if (!identifier) {
    return new Response(JSON.stringify({ message: "Identificador no proporcionado" }), { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }

  try {
    if (searchBy === "uid") {
      // Búsqueda por UID
      const userRef = doc(db, "users", identifier);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
      }

      return new Response(JSON.stringify(userDoc.data()));
    } else {
      // Búsqueda por cédula
      const userCollection = collection(db, "users");
      const q = query(userCollection, where("cedula", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
      }

      const userDoc = querySnapshot.docs[0].data();

      return new Response(JSON.stringify(userDoc));
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}

export async function PUT(request, { params }) {
  const { identifier } = params;
  const searchBy = request.nextUrl.searchParams.get('searchBy');

  if (!identifier) {
    return new Response(JSON.stringify({ message: "Identificador no proporcionado" }), { status: 400 });
  }

  const updateData = await request.json();

  try {
    const UpdateUserSchema = UserSchema.partial();
    UpdateUserSchema.parse(updateData);

    if (searchBy === "uid") {
      const userRef = doc(db, "users", identifier);
      await updateDoc(userRef, updateData);

      if (updateData.correo) {
        await updateUserEmail(identifier, updateData.correo); // Usa el UID del identificador
      }

      return new Response(JSON.stringify({ message: "Usuario actualizado correctamente" }));
    } else {
      const userCollection = collection(db, "users");
      const q = query(userCollection, where("cedula", "==", identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
      }

      const userRef = querySnapshot.docs[0].ref;
      await updateDoc(userRef, updateData);

      return new Response(JSON.stringify({ message: "Usuario actualizado correctamente" }));
    }
  } catch (error) {
    if (error.errors) {
      return new Response(JSON.stringify({ message: error.errors }), { status: 400 });
    } else {
      return new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }
  }
}

async function updateUserEmail(uid, newEmail) {
  try {
    await admin.auth().updateUser(uid, { email: newEmail });
    console.log(`Correo actualizado a ${newEmail} para el usuario con UID ${uid}`);
  } catch (error) {
    console.error("Error al actualizar el correo electrónico:", error);
  }
}