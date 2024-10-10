"use client";
import "rsuite/dist/rsuite.min.css";
import React, { useEffect, useState } from "react";
import { Avatar, Breadcrumb } from "rsuite";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { IoHomeSharp, IoChevronForwardSharp } from "react-icons/io5"; // Importa el ícono de casita

export default function HeadSide() {
  const { data: session, status } = useSession();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [urlSegments, setUrlSegments] = useState([]);
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/${session?.user.id}?searchBy=uid`
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

    setCurrentUrl(window.location.href);

    return () => clearInterval(intervalId);
  }, [session]);

  useEffect(() => {
    const pathSegments = pathname
      .split('/')
      .filter(segment => segment); // Filtra segmentos vacíos

    // Si el primer segmento es 'home', elimínalo
    if (pathSegments[0] === 'home') {
      pathSegments.shift();
    }

    setUrlSegments(pathSegments);
    setCurrentUrl(window.location.href);
  }, [pathname]);

  // Genera los elementos del breadcrumb
  const breadcrumbItems = urlSegments.map((segment, index) => {
    const href = '/' + urlSegments.slice(0, index + 1).join('/');
    return (
      <Breadcrumb.Item
        key={href}
        href={href}
        active={index === urlSegments.length - 1}
      >
        {segment}
      </Breadcrumb.Item>
    );
  });

  return (
    <>
      <header className="flex justify-between items-center w-full h-24 pt-16 pb-16">
        <section className="flex flex-col">
          <p className="text-base text-black p-0">
            <span className="text-[#A90B0B] font-bold">HORA: </span>
            <time className="text-lg">{currentTime}</time>
          </p>
          <p className="text-base text-black m-0">
            <span className="text-[#A90B0B] font-bold">FECHA: </span>
            <time className="text-lg">{currentDate}</time>
          </p>
        </section>

        <section className="flex gap-5 items-center">
          {data ? (
            <>
              <div className="text-base text-black text-right">
                <p className="text-lg font-semibold m-0">
                  {data.primerNombre + " " + data.primerApellido}
                </p>
                <p className="text-lg m-0">{data.rol.join(' - ')}</p>
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
            // Skeleton loader
            <div className="flex gap-5 items-center">
              {/* Skeleton text */}
              <div className="text-base text-black text-right">
                <div className="w-32 h-6 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                <div className="w-24 h-5 bg-gray-300 animate-pulse rounded-md"></div>
              </div>

              {/* Skeleton avatar */}
              <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-full"></div>
            </div>
          )}
        </section>
      </header>
      <div className="w-full mb-4 flex items-center h-4">
        <Breadcrumb separator={<IoChevronForwardSharp />} className="w-full mb-4 flex items-center">
          <Breadcrumb.Item href="/home">
            <IoHomeSharp />
          </Breadcrumb.Item>
          {breadcrumbItems}
        </Breadcrumb>
      </div>
    </>
  );
}
