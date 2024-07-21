
import { NextResponse } from "next/server";
import { db } from "../firebase/config"
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
    try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      return new Response(JSON.stringify(userList));
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    }
  }