'use client'
import React, { useState, useEffect } from 'react';
import NavbarUserOptions from '@/app/components/navbar/NavbarUserOptions';
import axios from 'axios';
import { Notification, useToaster } from 'rsuite';
import CoursesByProfesor from '@/app/components/cards/CoursesByProfesor';

export default function Page() {
    const toaster = useToaster();
    const [cedula, setCedula] = useState(null);
    const [user, setUser] = useState(null);
    const [active, setActive] = useState('cursos'); // Estado para la opción activa

    const extractCedulaFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const cedulaValue = pathSegments[pathSegments.length - 1];
            setCedula(cedulaValue);
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
        extractCedulaFromUrl();
    }, []);

    useEffect(() => {
        if (cedula) {
            fetchUser(cedula);
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
                            />
                        </picture>

                        <div>
                            <div className='flex items-center gap-3 pb-4'>
                                <h4>
                                    {[user?.primerNombre, user?.segundoNombre, user?.primerApellido, user?.segundoApellido]
                                        .filter(Boolean) // Filtrar valores no definidos o vacíos
                                        .join(' ')}
                                </h4>
                                <p className={`px-5 py-2 font-bold text-white rounded-lg ${user.estado === "Activo" ? "bg-[#039412]" : "bg-[#c53939]"}`}>{user.estado}</p>
                            </div>

                            <p> <b>Cédula:</b> {user.cedula}</p>
                            <p> <b>Correo:</b> {user.correo}</p>
                            <p> <b>Celular:</b> {user.celular}</p>
                            <p> <b>Rol:</b> {user.rol.join(' - ')}</p>
                            <p> <b>Sede:</b> {user.sede}</p>
                            <p> <b>Programas:</b> {user.programa_asignado.join(' - ')}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex-col'>
                    <div className='flex gap-3'>
                        <div className="w-56 h-56 bg-gray-300 animate-pulse rounded-md"></div>

                        <div className='w-full'>
                            <div className='flex items-center gap-3 pb-4'>
                                <div className="w-48 h-6 bg-gray-300 animate-pulse rounded-md"></div>
                                <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-md"></div>
                            </div>

                            <div className="w-52 h-5 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                            <div className="w-52 h-5 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                            <div className="w-52 h-5 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                            <div className="w-52 h-5 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                            <div className="w-52 h-5 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                            <div className="w-52 h-5 bg-gray-300 animate-pulse rounded-md mb-2"></div>
                        </div>
                    </div>
                </div>
            )}

            <NavbarUserOptions active={active} setActive={setActive} />

            <div>
                {active === 'cursos' && <CoursesByProfesor profesorCode={user?.cedula || ''} />}
            </div>
        </section>
    );
}
