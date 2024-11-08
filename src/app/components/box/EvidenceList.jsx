import React, { useEffect, useState } from 'react';
import PlusIcon from '@rsuite/icons/Plus';
import { IconButton, ButtonToolbar, Notification, useToaster, Accordion } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import EvidenceModal from '../modal/EvidenceModal';
import axios from 'axios';
import { FaFilePdf, FaFileExcel, FaImage, FaFile } from 'react-icons/fa';

export default function EvidenceList({ course, group, profesorCode, period, year }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [evidences, setEvidences] = useState([]);
    const [dataID, setDataID] = useState();
    const toaster = useToaster();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const fetchEvidence = async () => {
        console.log("Fetching evidence...");
        console.log("Curso:", course, "Grupo:", group); // Verifica que estos valores sean correctos
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/evidence?curso=${course}&grupo=${group}&periodo=${period}&año=${year}`);
            setEvidences(response.data);
            console.log(response.data);
            
            // Solo mostrar una notificación si la respuesta contiene evidencias
            if (response.data.length === 0) {
                toaster.push(
                    <Notification type="info" header="Sin evidencias" closable>
                        No hay evidencias disponibles para este curso y grupo.
                    </Notification>,
                    { placement: 'topEnd' }
                );
            }
        } catch (error) {
            console.error('Error fetching notes:', error.response ? error.response.data : error.message);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    No se pudieron cargar las evidencias. Inténtelo de nuevo más tarde.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    const handleConfirm = async (formValue) => {
        try {
            console.log('Submitting formValue:', formValue);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/evidence`, formValue, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response from server:', response);
            await fetchEvidence();
            toaster.push(
                <Notification type="success" header="Evidencia creada" closable>
                    La evidencia ha sido creada con éxito.
                </Notification>,
                { placement: 'topEnd' }
            );
            handleCloseModal();
        } catch (error) {
            console.error('Error creating evidence:', error.response ? error.response.data : error.message);
            toaster.push(
                <Notification type="error" header="Error" closable>
                    Hubo un problema al cargar la evidencia. Por favor, inténtelo de nuevo.
                </Notification>,
                { placement: 'topEnd' }
            );
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FaFilePdf className="text-red-600 text-3xl" />;
            case 'xlsx':
            case 'xls':
                return <FaFileExcel className="text-green-600 text-3xl" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <FaImage className="text-blue-600 text-3xl" />;
            default:
                return <FaFile className="text-gray-600 text-3xl" />;
        }
    };

    useEffect(() => {
        fetchEvidence(); // Carga las evidencias cuando el componente se monte
    }, [course, group]);

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex w-full justify-end'>
                <ButtonToolbar>
                    <IconButton className='shadow' icon={<PlusIcon />} onClick={handleOpenModal} color='blue'>
                        Añadir
                    </IconButton>
                </ButtonToolbar>
            </div>

            <Accordion bordered>
                {evidences.map(evidence => (
                    <Accordion.Panel key={evidence.id} header={
                        <div className='w-full flex gap-5 items-center justify-between pr-4 py-3 px-4 bg-gray-100 rounded-md transition duration-300 hover:bg-gray-200'>
                            <div className='flex items-center gap-3'>
                                <div className="p-2 bg-blue-100 rounded-md flex items-center justify-center">
                                    <FileUploadIcon color='blue' />
                                </div>
                                <span className='font-semibold text-gray-800'>{evidence.nombre_evidencia}</span>
                            </div>

                            <div className='flex'>
                                <div className='flex flex-col items-end text-gray-600 text-xs font-extralight'>
                                    <span>{formatDate(evidence.fecha)}</span>
                                    <span>{evidence.hora}</span>
                                </div>
                            </div>
                        </div>
                    }>
                        <p className='p-4 text-gray-700'>{evidence.descripcion}</p>
                        <div className='flex gap-5'>
                            {evidence.archivos.map((file, index) => (
                                <div key={index} className='flex items-center p-4 bg-gray-50 rounded-md shadow-md'>
                                    {getFileIcon(file.archivo_nombre)}
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className='ml-2 text-gray-800 font-medium'>
                                        {file.archivo_nombre}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </Accordion.Panel>
                ))}
            </Accordion>

            <EvidenceModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                course={course}
                group={group}
                profesorCode={profesorCode}
                year={year}
                period={period}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
