'use client'
import React, { useState, useEffect } from 'react';
import NavbarProgramOptions from '@/app/components/navbar/NavbarProgramOptions';
import axios from 'axios';
import { Notification, useToaster, Accordion } from 'rsuite';
import CoursesByProgram from '@/app/components/cards/CoursesByProgram';

export default function Page() {
    const toaster = useToaster();
    const [programID, setProgramID] = useState(null);
    const [program, setProgram] = useState(null);
    const [user, setUser] = useState(null);
    const [active, setActive] = useState('cursos');

    // Función para extraer el ID del programa de la URL
    const extractProgramIDFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const programValue = pathSegments[pathSegments.length - 1];
            setProgramID(programValue);
            console.log('Program ID:', programValue);
        }
    };

    // Función para obtener datos del programa
    const fetchProgram = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/program/${id}?searchBy=cedula`);
            setProgram(response.data);
            console.log('Program:', response.data);
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
        <section className=''>
            {program && user ? (
                <Accordion bordered>
                    <Accordion.Panel header={`PROGRAMA: ${program.nombre_programa}`}>
                        <div className='course-info'>
                            <p className='mb-2'><strong>Facultad:</strong> {program.facultad}</p>
                            <p className='mb-2'><strong>Sede:</strong> {program.sede}</p>
                            <p className='mb-2'><strong>Modalidad:</strong> {program.modalidad}</p>
                            <p className='mb-2'><strong>Jornada:</strong> {program.jornada}</p>
                            <p className='mb-2'><strong>Créditos:</strong> {program.creditos}</p>
                            <p className='mb-2'><strong>Duración:</strong> {program.duracion}</p>
                            <p className='mb-2'><strong>Periocidad de Admisiones:</strong> {program.periodicidad_de_admisiones}</p>
                            <p className='mb-2'><strong>Fecha de Creación</strong> {new Date(program.fecha_dec_creacion).toLocaleDateString()}</p>
                            <p className='mb-2'><strong>Coordinador:</strong> {user.primerNombre} {user.segundoNombre} {user.primerApellido} {user.segundoApellido} - {user.cedula}</p>
                            <p className='mb-2'><strong>Registro ICFES:</strong> {program.registro_ICFES}</p>
                            <p className='mb-2'><strong>Registro SNIES:</strong> {program.registro_SNIES}</p>
                            <p className='mb-2'><strong>Resolución MEN:</strong> {program.resolucion_MEN}</p>
                            <p className='mb-2'><strong>Resulución Pensum:</strong> {program.resolucion_del_PENSUM}</p>
                            <p className='mb-2'><strong>Correo:</strong> {program.email}</p>
                        </div>
                    </Accordion.Panel>
                </Accordion>
            ) : (
                <div className='border  bg-gray-100 rounded-md p-6 animate-pulse'>
                    <div className="flex items-center gap-2">
                        <div className='flex flex-col w-full gap-2'>
                            <div className='bg-gray-200 h-4 w-1/4 animate-pulse'></div>
                        </div>
                    </div>
                </div>
            )}
            <NavbarProgramOptions active={active} setActive={setActive} />
            <div>
                {active === 'cursos' && <CoursesByProgram programCode={program?.codigo || ''} />}
            </div>
        </section>
    );
}
