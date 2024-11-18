'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Notification, useToaster, Accordion } from 'rsuite';
import GroupsByCourse from '@/app/components/cards/GroupsByCourse';



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
            console.log('Course ID:', courseValue);
            setCourseID(courseValue);
        }
    };

    // Función para obtener datos del curso
    const fetchCourse = async (id) => {
        try {//El id debe ser el id del programa
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course/${id}`);
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
        <section className='pb-10'>

            {loading ? (
                <div className='border  bg-gray-100 rounded-md p-6 animate-pulse'>
                    <div className="flex items-center gap-2">
                        <div className='flex flex-col w-full gap-2'>
                            <div className='bg-gray-200 h-4 w-1/4 animate-pulse'></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex-col'>
                    {course && user ? (
                        <Accordion bordered>
                            <Accordion.Panel header={`CURSO: ${course.nombre_curso}`}>
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

            {course && user && (

                <div>
                    <GroupsByCourse courseCode={course.codigo} />
                </div>
             )
            }

            {/* <NavbarCourseOptions active={active} setActive={setActive} />
            <div>
                {active === 'notas' && course && <HandsontableSheet course={course.codigo} group={course.grupo}/>}
                {active === 'evidencias' && course && <EvidenceList course={course.codigo} group={course.grupo} profesorCode={course.Profesor}/>}
            </div> */}
        </section>
    );
}
