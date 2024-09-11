'use client'
import React, { useState, useEffect } from 'react';
import NavbarUserOptions from '@/app/components/navbar/NavbarUserOptions';
import axios from 'axios';
import { Notification, useToaster } from 'rsuite';
import { AvatarGroup, Avatar } from 'rsuite';

export default function Page() {
    const toaster = useToaster();
    const [cedula, setCedula] = useState(null); // Estado para almacenar la cédula
    const [user, setUser] = useState(null); // Estado para los usuarios

    // Función para extraer la cédula de la URL
    const extractCedulaFromUrl = () => {
        if (typeof window !== 'undefined') { // Verifica que estás en el lado del cliente
            const currentPath = window.location.pathname; // Obtiene la ruta completa del navegador
            const pathSegments = currentPath.split('/'); // Divide la ruta en partes
            const cedulaValue = pathSegments[pathSegments.length - 1]; // Toma la última parte que debería ser la cédula
            setCedula(cedulaValue); // Almacena la cédula en el estado
        }
    };

    const fetchUser = async (cedula) => {
        console.log("Fetching users...");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${cedula}?searchBy=cedula`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudieron cargar los usuarios. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    useEffect(() => {
        extractCedulaFromUrl(); // Extrae la cédula cuando el componente se monta
    }, []);

    useEffect(() => {
        if (cedula) {
            fetchUser(cedula); // Realiza la llamada de API si la cédula está disponible
        }
    }, [cedula]);

    return (
        <section className='h-full'>
            {user ? (
                <div className='flex-col'>
                    <div className='flex gap-3'>
                        <picture className='border-2 rounded-md border-[#c53939] p-1'>
                            <source srcSet="https://i.pravatar.cc/150?u=1" media="(min-width: 768px)" />
                            <source srcSet="https://i.pravatar.cc/150?u=1" media="(min-width: 400px)" />
                            <img
                                className="min-w-60 min-h-60 rounded-md"
                                src="https://i.pravatar.cc/150?u=1"
                                alt="Avatar"
                            />                     </picture>

                        <div>
                            <div className='flex items-center gap-3 pb-4'>
                                <h4>
                                    {/* Mostrar los nombres y apellidos con un espacio entre ellos */}
                                    {[user?.primerNombre, user?.segundoNombre, user?.primerApellido, user?.segundoApellido]
                                        .filter(Boolean) // Filtrar valores no definidos o vacíos
                                        .join(' ')} {/* Unirlos con un espacio */}
                                </h4>
                                <p className={`px-5 py-2 font-bold text-white rounded-lg ${user.estado === "Activo" ? "bg-[#039412]" : "bg-[#c53939]"}`}>{user.estado}</p>
                            </div>

                            <p> <b>Cedula:</b> {user.cedula}</p>
                            <p> <b>Correo:</b> {user.correo}</p>
                            <p> <b>Celular:</b> {user.celular}</p>
                            <p>
                                <b>Rol:</b> {user.rol.join(' - ')}
                            </p>
                            <p> <b>Sede:</b> {user.sede}</p>
                            <p> <b>Programas:</b> {user.programa_asignado.join(' - ')}</p>
                        </div>
                    </div>
                    <NavbarUserOptions />

                </div>


            ) : (
                <p>Cargando usuarios...</p>
            )}
        </section>
    );
}
