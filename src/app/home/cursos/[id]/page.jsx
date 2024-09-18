'use client'
import React, { useState, useEffect } from 'react';
import NavbarUserOptions from '@/app/components/navbar/NavbarUserOptions';
import axios from 'axios';
import { Notification, useToaster } from 'rsuite';

export default function Page() {
    const toaster = useToaster();
    const [courseID, setCourseID] = useState(null);
    const [course, setCourse] = useState(null);
    const [user, setUser] = useState(null);

    // Función para extraer el ID del coursea de la URL
    const extractcourseIDFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const courseValue = pathSegments[pathSegments.length - 1];
            setCourseID(courseValue);
        }
    };

    // Función para obtener datos del coursea
    const fetchCourse = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course/${id}?searchBy=cedula`);
            setCourse(response.data);

            // Llamar a fetchUser una vez que los datos del coursea estén disponibles
            fetchUser(response.data.ID_coordinador);
        } catch (error) {
            console.error('Error fetching course:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudo cargar el coursea. Inténtelo de nuevo más tarde.
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
        extractcourseIDFromUrl();
    }, []);

    useEffect(() => {
        if (courseID) {
            fetchCourse(courseID);
        }
    }, [courseID]);

    return (
        <section className='h-full'>
            {course && user ? (
                <div className='flex-col p-4'>

                    <div className='course-info'>
                        <h3 className='mb-2'>{course.nombre_curso}</h3>
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
                    <NavbarUserOptions />
                </div>
            ) : (
                <p>Cargando curso...</p>
            )}
        </section>
    );
}
