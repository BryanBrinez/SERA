"use client"
import React from "react";
import { signOut, useSession } from "next-auth/react";

export default function Prueba() {
    const { data: session } = useSession();
    console.log(session, "la sesion")
  return (
    <div>
      <p className="max-w-64 text-21xl">
        !Hola Kevin! Aquí está tu área personal.
      </p>
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
