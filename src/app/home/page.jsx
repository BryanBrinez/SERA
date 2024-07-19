"use client"
import React from "react";
import { signOut, useSession } from "next-auth/react";

export default function Prueba() {
    const { data: session } = useSession();
    console.log(session, "la sesion")
  return (
    <div>
      <button
        className={
          "flex items-center text-red-500 font-light  hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base"
        }
        onClick={signOut}
      >
        SISA
      </button>
    </div>
  );
}
