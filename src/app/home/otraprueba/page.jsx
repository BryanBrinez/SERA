"use client"
import React from 'react'
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function page() {
  const { data: session, status  } = useSession();
console.log(session?.user?.email)
  
  useEffect(() => {
    
  }, [session?.user.email]);


  if (status === "authenticated") {
    return <p>Signed in as {session.user.id}</p>
  }
    
  return (
    <div>page</div>
  )
}
