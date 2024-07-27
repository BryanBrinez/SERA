import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  console.log("GET request received");
  try {
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //console.log("User list:", userList);
    return new Response(JSON.stringify(userList), {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}
