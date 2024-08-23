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

      <div className="w-full h-[700px] py-10">
        <img className="h-full shadow-2xl rounded-xl" src="https://www.univalle.edu.co/images/sede-tulua-uv.png" alt="sede" />
      </div>
      
      
    </div>
  );
}
