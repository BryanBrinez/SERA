'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporizador de 5 segundos antes de redirigir
    const timer = setTimeout(async () => {
      try {
        await router.push('/home/area-personal');
      } finally {
        setLoading(false);
      }
    }, 2000); // 5 segundos de retraso

    // Limpieza del temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className={`h-screen w-screen flex justify-center items-center ${loading ? 'bg-[#880a0a]' : ''}`}>
      <div className="flex justify-center items-center relative">
        {/* Círculo pulsante */}
        <div className="w-16 h-16  rounded-full animate-pulse-custom"></div>
        {/* SVG pulsante */}
        <div className="absolute inset-0 flex justify-center items-center animate-pulse-custom">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 225.000000 225.000000" preserveAspectRatio="xMidYMid meet" className="w-12 h-12">
            <g transform="translate(0.000000,225.000000) scale(0.1,-0.1)" fill="#000000" stroke="none">
              <path d="M0 1125 l0 -1125 1125 0 1125 0 0 1125 0 1125 -1125 0 -1125 0 0 -1125z m1485 475 l0 -265 -267 -3 -268 -2 120 -240 119 -239 -57 -22 c-69 -27 -223 -37 -302 -20 -140 30 -287 142 -354 270 -60 114 -66 158 -66 494 l0 297 538 -2 537 -3 0 -265z m544 -297 c0 -5 -116 -240 -258 -523 l-258 -515 -257 513 c-141 281 -256 516 -256 522 0 7 177 10 515 10 283 0 515 -3 514 -7z" />
            </g>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .animate-pulse-custom {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
