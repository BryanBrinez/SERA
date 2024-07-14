// /src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { auth } from "../../firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return NextResponse.json({ uid: user.uid, email: user.email });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
