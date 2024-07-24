"use client";
import "rsuite/dist/rsuite.min.css";
import React, { useEffect, useState } from "react";
import { Avatar } from "rsuite";
import { useSession } from "next-auth/react";

export default function HeadSide() {
  const { data: session, status } = useSession();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState(null);  // Cambiado a null para inicializar sin datos

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/${session?.user.id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();
      setData(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (session?.user.id) fetchUser();

    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      setCurrentTime(now.toLocaleTimeString([], optionsTime));
      setCurrentDate(now.toLocaleDateString([], optionsDate));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, [session]);

  return (
    <header className="flex justify-between items-center w-full h-24 pt-16 pb-16 ">
      <section>
        <p className="text-base text-black">
          <span className="text-[#A90B0B] font-bold">HORA: </span>
          <time className="text-lg">{currentTime}</time>
        </p>
        <p className="text-base text-black">
          <span className="text-[#A90B0B] font-bold">FECHA: </span>
          <time className="text-lg">{currentDate}</time>
        </p>
      </section>

      <section className="flex gap-5 items-center">
        {data ? (
          <>
            <div className="text-base text-black text-right">
              <p className="text-lg font-semibold">
                {data.primerNombre + " " + data.primerApellido}
              </p>
              <p className="text-lg">{data.rol}</p>
            </div>
            <Avatar
              size="lg"
              color="red"
              bordered
              circle
              src="https://i.pravatar.cc/150?u=1"
              alt={`Profile picture of ${data.primerNombre} ${data.primerApellido}`}
            />
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </section>
    </header>
  );
}
