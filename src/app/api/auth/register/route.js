// /src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { auth } from "../../firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return NextResponse.json({ uid: user.uid, email: user.email });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
