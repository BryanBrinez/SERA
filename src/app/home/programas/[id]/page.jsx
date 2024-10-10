'use client'
import React, { useState, useEffect } from 'react';
import NavbarUserOptions from '@/app/components/navbar/NavbarUserOptions';
import axios from 'axios';
import { Notification, useToaster } from 'rsuite';

export default function Page() {
    const toaster = useToaster();
    const [programID, setProgramID] = useState(null);
    const [program, setProgram] = useState(null);
    const [user, setUser] = useState(null);

    // Función para extraer el ID del programa de la URL
    const extractProgramIDFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const programValue = pathSegments[pathSegments.length - 1];
            setProgramID(programValue);
        }
    };

    // Función para obtener datos del programa
    const fetchProgram = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/program/${id}?searchBy=cedula`);
            setProgram(response.data);

            // Llamar a fetchUser una vez que los datos del programa estén disponibles
            fetchUser(response.data.ID_coordinador);
        } catch (error) {
            console.error('Error fetching program:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudo cargar el programa. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    // Función para obtener datos del usuario (coordinador)
    const fetchUser = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${id}?searchBy=uid`);
            
            if (response.data) {
                setUser(response.data);
            } else {
                // Si el usuario no se encuentra, establecer valor de "No registrado"
                setUser({
                    primerNombre: 'No',
                    segundoNombre: '',
                    primerApellido: 'registrado',
                    segundoApellido: '',
                    cedula: ''
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
    
            // Si hay un error al buscar el usuario, establecer valor de "No registrado"
            setUser({
                primerNombre: '',
                segundoNombre: '',
                primerApellido: '',
                segundoApellido: '',
                cedula: ''
            });
        }
    };

    useEffect(() => {
        extractProgramIDFromUrl();
    }, []);

    useEffect(() => {
        if (programID) {
            fetchProgram(programID);
        }
    }, [programID]);

    return (
        <section className='h-full'>
            {program && user ? (
                <div className='flex-col p-4'>
                    <h3 className='mb-2'>{program.nombre_programa} - {program.codigo}</h3>
                    <div className='mb-2'>
                        <strong>Facultad:</strong> {program.facultad}
                    </div>
                    <div className='mb-2'>
                        <strong>Sede:</strong> {program.sede}
                    </div>
                    <div className='mb-2'>
                        <strong>Modalidad:</strong> {program.modalidad}
                    </div>
                    <div className='mb-2'>
                        <strong>Jornada:</strong> {program.jornada}
                    </div>
                    <div className='mb-2'>
                        <strong>Creditos:</strong> {program.creditos}
                    </div>
                    <div className='mb-2'>
                        <strong>Duración:</strong> {program.duracion} semestres
                    </div>
                    <div className='mb-2'>
                        <strong>Periodicidad de Admisiones:</strong> {program.periodicidad_de_admisiones}
                    </div>
                    <div className='mb-2'>
                        <strong>Fecha de Creación:</strong> {new Date(program.fecha_dec_creacion).toLocaleDateString()}
                    </div>
                    <div className='mb-2'>
                        <strong>Coordinador:</strong> {user.primerNombre} {user.segundoNombre} {user.primerApellido} {user.segundoApellido} - {user.cedula}
                    </div>
                    <div className='mb-2'>
                        <strong>Registro ICFES:</strong> {program.registro_ICFES}
                    </div>
                    <div className='mb-2'>
                        <strong>Registro SNIES:</strong> {program.registro_SNIES}
                    </div>
                    <div className='mb-2'>
                        <strong>Resolución MEN:</strong> {program.resolucion_MEN}
                    </div>
                    <div className='mb-2'>
                        <strong>Resolución del Pensum:</strong> {program.resolucion_del_PENSUM}
                    </div>
                    <div className='mb-2'>
                        <strong>Email:</strong> {program.email}
                    </div>
                    
                </div>
            ) : (
                // Skeleton mientras se cargan los datos
                <div className='flex flex-col p-4'>
                    <div className='animate-pulse flex flex-col gap-3 rounded-lg'>
                        <div className='h-8 bg-gray-200 rounded w-2/4'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                    </div>
                </div>
            )}
            <NavbarUserOptions />
        </section>
    );
}
