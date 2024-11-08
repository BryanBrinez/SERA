'use client';
import React, { useState, useEffect } from 'react';
import NavbarCourseOptions from '@/app/components/navbar/NavbarCourseOptions';
import EvidenceList from '@/app/components/box/EvidenceList';
import axios from 'axios';
import { Notification, useToaster, Accordion } from 'rsuite';
import HandsontableSheet from '@/app/components/table/handsontableSheet';


export default function Page() {
    const toaster = useToaster();
    const [groupData, setGroupData] = useState(null);
    const [course, setCourse] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [active, setActive] = useState('notas');


    // Función para extraer el grupo, año y perido de la URL
    const extractDataFromUrl = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split('/');
            const data = pathSegments[pathSegments.length - 1];

            console.log('data', data);

            // Separar `data` en `grupo`, `año`, y `periodo`
            const [grupoNum, año, periodo] = data.split('-');

            // Crear el objeto con los valores correspondientes
            const group = {
                grupoNum,
                año,
                periodo,
            };

            console.log(group);
            setGroupData(group);
        }
    };

    // Función para obtener datos del curso
    const fetchGroup = async (groupData) => {
        try {
            const { grupoNum, año, periodo } = groupData;
            const grupoNumInt = parseInt(grupoNum, 10);
            // Asegúrate de que el uid lo obtienes de alguna parte si es dinámico
    
            // Construir la URL con los parámetros de la URL
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/group/${grupoNumInt}`, {
                params: {
                    grupoNum: grupoNumInt,
                    año,
                    periodo
                },
            });
    
            console.log(response.data);
    
            // Si necesitas hacer algo con los datos recibidos, puedes procesarlos aquí
            setData(response.data);
            // fetchUser(response.data.ID_coordinador);
        } catch (error) {
            console.error('Error fetching group:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudo cargar la información del grupo. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };
    

    // // Función para obtener datos del usuario (coordinador)
    // const fetchUser = async (id) => {
    //     try {
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user/${id}?searchBy=uid`);

    //         if (response.data) {
    //             setUser(response.data);
    //         } else {
    //             // Si el usuario no se encuentra, establecer valor de "No registrado"
    //             setUser({
    //                 primerNombre: 'No',
    //                 segundoNombre: '',
    //                 primerApellido: 'registrado',
    //                 segundoApellido: '',
    //                 cedula: ''
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user:', error);

    //         // Si hay un error al buscar el usuario, establecer valor de "No registrado"
    //         setUser({
    //             primerNombre: '',
    //             segundoNombre: '',
    //             primerApellido: '',
    //             segundoApellido: '',
    //             cedula: ''
    //         });
    //     } finally {
    //         setLoading(false); // Cambia loading a false al final
    //     }
    // };

    useEffect(() => {
        extractDataFromUrl();
    }, []);

    useEffect(() => {
        if (groupData) {
            fetchGroup(groupData);
        }
    }, [groupData]);

    return (
        <section className='pb-10'>

            {
                data && (
                    <div className='mb-4'>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            {data.Curso}
                        </h1>
                        <h2 className='text-lg font-semibold text-gray-600'>
                            Grupo {data.grupo}, {data.jornada}
                        </h2>
                        <h3 className='text-lg font-semibold text-gray-600'>
                            Año: {data.año} - Período: {data.periodo}
                        </h3>
                    </div>)
            }
            <NavbarCourseOptions active={active} setActive={setActive} />
            <div>
                {active === 'notas' && data && <HandsontableSheet course={data.Curso} group={data.grupo} period={data.periodo} year={data.año}/>}
                {active === 'evidencias' && data && <EvidenceList course={data.curso} group={data.grupo} profesorCode={data.Profesor} />}
            </div>
        </section>
    );
}
