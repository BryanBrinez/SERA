'use client';
import React, { useEffect, useState } from 'react';
import { IconButton, ButtonToolbar, Notification, useToaster, Input, Panel, Placeholder, Accordion } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import GridIcon from '@rsuite/icons/Grid';
import axios from 'axios';

export default function Results() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [searchText, setSearchText] = useState('');
    const toaster = useToaster();


    const fetchResults = async () => {
        console.log("Fetching results...");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/resultadoaprendizaje`);
            console.log(response)
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudieron cargar los programas. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    const fetchIndicators = async () => {
        console.log("Fetching indicators...");
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/indicadorlogro`);
            console.log(response)
            setIndicators(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudieron cargar los programas. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };



    //   const handleConfirm = async (formValue) => {
    //     try {
    //       console.log('Submitting formValue:', formValue);
    //       const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/program/register`, formValue, {
    //         headers: {
    //           'Content-Type': 'application/json'
    //         }
    //       });
    //       console.log('Response from server:', response);

    //       fetchResults();

    //       toaster.push(
    //         <Notification type="success" header="Programa creado" closable>
    //           El programa ha sido creado con éxito.
    //         </Notification>,
    //         { placement: 'topEnd' }
    //       );
    //       handleCloseModal();
    //     } catch (error) {
    //       console.error('Error creating user:', error.response ? error.response.data : error.message);
    //       console.log(error)
    //       toaster.push(
    //         <Notification type="error" header="Error" closable>
    //           Hubo un problema al crear el programa. Por favor, inténtelo de nuevo.
    //         </Notification>,
    //         { placement: 'topEnd' }
    //       );
    //     }
    //   };

    useEffect(() => {
        fetchResults();
        fetchIndicators();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        fetchResults();
        setIsModalOpen(false);
    };

    return (
        <div className='pb-5'>
            <h3>Resultados de aprendizaje</h3>
            <div className='pt-14 pb-5 flex justify-end gap-3'>
                <ButtonToolbar>
                    <IconButton className='shadow' icon={<PlusIcon />} onClick={handleOpenModal}>
                        Añadir
                    </IconButton>
                </ButtonToolbar>
                <Input
                    placeholder="Buscar..."
                    value={searchText}
                    onChange={(value) => setSearchText(value)}
                    style={{ width: 300 }}
                />
            </div>
            <div className='flex flex-col gap-3'>
                {
                    results?.length > 0 && results.map((result) => (
                        <div key={result.id} className=''>
                            <Panel
                                header={(
                                    <div className="flex items-center gap-2">
                                        <div className="p-3 bg-gray-200 rounded-md ">
                                            <GridIcon color='red' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <p>{result.nombre_resultado}</p>
                                            <span className='font-light text-sm'>{result.descripcion}</span>
                                        </div>

                                    </div>
                                )}
                                collapsible
                                bordered
                            >

                                <div className='flex justify-between items-center py-3'>
                                    <p className='font-bold text-base'>Indicadores de logro</p>
                                    <ButtonToolbar>
                                        <IconButton className='shadow' icon={<PlusIcon />} onClick={handleOpenModal}>
                                            Añadir
                                        </IconButton>
                                    </ButtonToolbar>

                                </div>

                                <Accordion className='text-sm bg-[#fbfbfb]' >

                                    {
                                        indicators && indicators.filter(indicator => indicator.id_resultado_aprendizaje === result.codigo).map((indicator) => (
                                            <Accordion.Panel header={indicator.nombre_indicador} key={indicator.id} className='font-light p-0 m-0'>
                                                {/* <span> {indicator.codigo}</span> */}
                                                <span>{indicator.descripcion}</span>
                                                
                                            </Accordion.Panel>
                                        ))
                                    }
                                </Accordion>

                            </Panel>
                        </div>
                    ))
                }

            </div>

        </div>
    )
}
