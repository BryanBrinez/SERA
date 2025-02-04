'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Notification, useToaster, Accordion, Button , ButtonToolbar, IconButton} from 'rsuite';
import GroupsByCourse from '@/app/components/cards/GroupsByCourse';
import { useRouter } from 'next/navigation'; // Importa useRouter para la navegación
import PlusIcon from '@rsuite/icons/Plus';

import { GroupModal } from '../../../components/modal/GroupModal';

export default function Page() {
    const toaster = useToaster();
    const [courseID, setCourseID] = useState(null);
    const [course, setCourse] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('notas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter(); // Inicializa useRouter


    const extractCourseIDFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const courseValue = pathSegments[pathSegments.length - 1];
            console.log('Course ID:', courseValue);
            setCourseID(courseValue);
        }
    };

    const fetchCourse = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course/${id}`);
            setCourse(response.data);
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

    const fetchUser = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${id}?searchBy=uid`);

            if (response.data) {
                setUser(response.data);
            } else {
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
            setUser({
                primerNombre: '',
                segundoNombre: '',
                primerApellido: '',
                segundoApellido: '',
                cedula: ''
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (formValue) => {
        try {
          console.log('Submitting formValue:', formValue);
          const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/group`, formValue, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Response from server:', response);
        
          if (courseID) {
            fetchCourse(courseID);
            }
    
          toaster.push(
            <Notification type="success" header="Facultad creada" closable>
              El grupo ha sido creado con éxito.
            </Notification>,
            { placement: 'topEnd' }
          );
          handleCloseModal();
        } catch (error) {
          console.error('Error creating user:', error.response ? error.response.data : error.message);
          console.log(error)
          toaster.push(
            <Notification type="error" header="Error" closable>
              Hubo un problema al crear el grupo. Por favor, inténtelo de nuevo.
            </Notification>,
            { placement: 'topEnd' }
          );
        }
      }

    const handleCreateGroup = () => {
        // Redirige a la página de creación de grupo
        router.push(`/course/${courseID}/create-group`);
    };

    useEffect(() => {
        extractCourseIDFromUrl();
    }, []);

    useEffect(() => {
        if (courseID) {
            fetchCourse(courseID);
        }
    }, [courseID]);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        if (courseID) {
            fetchCourse(courseID);
        }
        setIsModalOpen(false);
    };

    return (
        <section className='pb-10'>
            {loading ? (
                <div className='border bg-gray-100 rounded-md p-6 animate-pulse'>
                    <div className="flex items-center gap-2">
                        <div className='flex flex-col w-full gap-2'>
                            <div className='bg-gray-200 h-4 w-1/4 animate-pulse'></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex-col mb-3'>
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
                    <div className='w-full flex justify-end'>
                        <ButtonToolbar>
                            <IconButton className='shadow' icon={<PlusIcon />} onClick={handleOpenModal}>
                                Añadir Grupo
                            </IconButton>
                        </ButtonToolbar>

                    </div>
                    <GroupsByCourse courseCode={course.codigo} />
                    <GroupModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} courseID={courseID} />
                </div>
            )}
        </section>
    );
}