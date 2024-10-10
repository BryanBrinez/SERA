'use client';
import React, { useState, useEffect } from 'react';
import NavbarCourseOptions from '@/app/components/navbar/NavbarCourseOptions';
import axios from 'axios';
import { Notification, useToaster, Accordion } from 'rsuite';
import NotesSheet from '@/app/components/table/NotesSheet';
import HandsontableSheet from '@/app/components/table/handsontableSheet';


export default function Page() {
    const toaster = useToaster();
    const [courseID, setCourseID] = useState(null);
    const [course, setCourse] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [active, setActive] = useState('notas');
    // Función para extraer el ID del curso de la URL
    const extractCourseIDFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const courseValue = pathSegments[pathSegments.length - 1];
            setCourseID(courseValue);
        }
    };

    // Función para obtener datos del curso
    const fetchCourse = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course/${id}?searchBy=cedula`);
            setCourse(response.data);

            // Llamar a fetchUser una vez que los datos del curso estén disponibles
            fetchUser(response.data.ID_coordinador);
        } catch (error) {
            console.error('Error fetching course:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudo cargar el curso. Inténtelo de nuevo más tarde.
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
        } finally {
            setLoading(false); // Cambia loading a false al final
        }
    };

    useEffect(() => {
        extractCourseIDFromUrl();
    }, []);

    useEffect(() => {
        if (courseID) {
            fetchCourse(courseID);
        }
    }, [courseID]);

    return (
        <section className='h-full'>

            {loading ? (
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
            ) : (
                <div className='flex-col'>
                    {course && user ? (
                        <Accordion bordered>
                            <Accordion.Panel header= {course.nombre_curso}>
                                <div className='course-info'>
                                    <p className='mb-2'><strong>Código:</strong> {course.codigo}</p>
                                    <p className='mb-2'><strong>Estado:</strong> {course.estado}</p>
                                    <p className='mb-2'><strong>Profesor:</strong> {course.Profesor}</p>
                                    <p className='mb-2'><strong>Programa:</strong> {course.codigo_programa}</p>
                                    <p className='mb-2'><strong>Créditos:</strong> {course.creditos}</p>
                                    <p className='mb-2'><strong>Grupo:</strong> {course.grupo}</p>
                                    <p className='mb-2'><strong>Jornada:</strong> {course.jornada}</p>
                                    <p className='mb-2'><strong>Intensidad Horaria:</strong> {course.intensidad_horaria} horas</p>
                                    <p className='mb-2'><strong>Habilitable:</strong> {course.habilitable}</p>
                                    <p className='mb-2'><strong>Validable:</strong> {course.validable}</p>
                                    <p className='mb-2'><strong>Prerrequisitos:</strong> {course.prerrequisitos.join(", ")}</p>
                                </div>
                            </Accordion.Panel>
                        </Accordion>

                    ) : (
                        <p>No se encontraron datos del curso o del usuario.</p>
                    )}
                </div>
            )}
            <NavbarCourseOptions active={active} setActive={setActive} />
            <div>
                {active === 'notas' && course && <HandsontableSheet course={course.codigo} group={course.grupo}/>}
            </div>
        </section>
    );
}
