'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'rsuite';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirige a la ruta deseada cuando el componente se monta
    const redirect = async () => {
      try {
        await router.push('/home/area-personal');
      } finally {
        setLoading(false);
      }
    };
    redirect();
  }, [router]);

  return (
    <main className='h-screen w-screen flex justify-center items-center'>
      {loading ? (
        <Loader size="lg" />
      ) : (
        <div>SERA UNIVALLE</div>
      )}
    </main>
  );
}
