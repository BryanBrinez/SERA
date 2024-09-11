'use client'
import React, { useState, useEffect } from 'react';
import NavbarUserOptions from '@/app/components/navbar/NavbarUserOptions';
import axios from 'axios';
import { Notification, useToaster } from 'rsuite';


export default function Page() {
    const toaster = useToaster();
    const [programID, setProgramID] = useState(null); // Estado para almacenar la cédula
    const [program, setProgram] = useState(null); // Estado para los usuarios
    const [user, setUser] = useState(null);
    // Función para extraer la cédula de la URL
    const extractProgramIDFromUrl = () => {
        if (typeof window !== 'undefined') { // Verifica que estás en el lado del cliente
            const currentPath = window.location.pathname; // Obtiene la ruta completa del navegador
            const pathSegments = currentPath.split('/'); // Divide la ruta en partes
            const programValue = pathSegments[pathSegments.length - 1]; // Toma la última parte que debería ser la cédula
            setProgramID(programValue); // Almacena la cédula en el estado
        }
    };

    

    const fetchProgram = async (id) => {
        console.log("Fetching users...");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/program/${id}?searchBy=cedula`);
            setProgram(response.data);
            fetchUser(response.data.ID_coordinador)
        } catch (error) {
            console.error('Error fetching users:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudo cargar el programa. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    const fetchUser = async (id) => {
        console.log("Fetching users...");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${id}?searchBy=uid`);
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
        extractProgramIDFromUrl(); // Extrae la cédula cuando el componente se monta
    }, []);

    useEffect(() => {
        if (programID) {
            fetchProgram(programID); // Realiza la llamada de API si la cédula está disponible
        }
    }, [programID]);

    return (
        <section className='h-full'>
            {program ? (
                <div className='flex-col p-4'>
                    <h3 className='mb-2'>{program.nombre_programa}</h3>

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
                    <NavbarUserOptions />
                </div>



            ) : (
                <p>Cargando programa...</p>
            )}
        </section>
    );
}
