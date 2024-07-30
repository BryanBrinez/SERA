"use client"
import React from "react";
import { useSession } from "next-auth/react";


export default function AreaPersonal() {
    const { data: session } = useSession();

  return (
    <div>
      <p className="max-w-64 text-21xl">
        !Hola {session?.user.primerNombre}! Aquí está tu área personal.
      </p>
      
    </div>
  );
}
