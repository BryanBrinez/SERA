import { storage } from '../../api/firebase/config'; // Ruta correcta de tu configuración de Firebase
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Ruta para las opciones de autenticación

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(JSON.stringify({ message: "Acceso no autorizado" }), { status: 403 });
    }

    try {
        // Obtener los parámetros de búsqueda de la URL
        const { searchParams } = new URL(req.url);
        const cedula = searchParams.get("cedula");

        if (!cedula) {
            return new Response(JSON.stringify({ message: "Cédula es requerida" }), { status: 400 });
        }

        // Crear la referencia a la carpeta de Firebase Storage
        const storageRef = ref(storage, `certificados/${cedula}`);

        // Obtener la lista de archivos en esa carpeta
        const result = await listAll(storageRef);

        // Obtener las URLs de los archivos
        const fileUrls = await Promise.all(
            result.items.map(async (item) => {
                const url = await getDownloadURL(item); // Obtener la URL pública
                return { url, archivo_nombre: item.name }; // Devolver el nombre y la URL
            })
        );

        // Si no se encuentran archivos, devolver un mensaje adecuado
        if (fileUrls.length === 0) {
            return new Response(JSON.stringify({ message: "No se encontraron certificados" }), { status: 404 });
        }

        // Devolver los archivos
        return new Response(JSON.stringify(fileUrls), {
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
