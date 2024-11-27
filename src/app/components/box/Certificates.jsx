'use client';

import React, { useState, useEffect } from 'react';
import { IconButton, ButtonToolbar, Notification, useToaster, Input, Accordion } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import axios from 'axios';
import { FaFilePdf, FaFileExcel, FaImage, FaFile } from 'react-icons/fa';
import { CertificateModal } from '../../components/modal/CertificateModal';
import Link from 'next/link';

export default function Certificates({ cedula }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [searchText, setSearchText] = useState('');
  const toaster = useToaster();

  // Obtener los certificados desde la API
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/certificates?cedula=${cedula}`);
      setCertificates(response.data);

      console.log("LA DATAAAAAAAAAAAAAAAAAAAAA", response.data)
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error" closable>
          No se pudieron cargar los certificados. Inténtelo de nuevo más tarde.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchCertificates(); // Recargar los certificados después de cerrar el modal
    setIsModalOpen(false);
  };

  const handleConfirm = async (formData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/certificates/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchCertificates(); // Recargar la lista de certificados
      toaster.push(
        <Notification type="success" header="Certificado subido" closable>
          El certificado ha sido subido con éxito.
        </Notification>,
        { placement: 'topEnd' }
      );
      handleCloseModal();
    } catch (error) {
      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al subir el certificado. Inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  useEffect(() => {
    fetchCertificates();
    // Cargar certificados cuando se monta el componente
  }, [cedula]); // Dependencia de `cedula` para recargar cuando cambie

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

  return (
    <div>
      <h3>Gestión de Certificados</h3>
      <div className="pt-14 pb-5 flex justify-end gap-3">
        <ButtonToolbar>
          <IconButton className="shadow" icon={<PlusIcon />} onClick={handleOpenModal}>
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

      {/* Mostrar los certificados filtrados con el estilo de Accordion */}
      <Accordion bordered>
        {certificates
          .filter(cert => cert.archivo_nombre.toLowerCase().includes(searchText.toLowerCase()))
          .map((certificate, index) => (
            <Accordion.Panel
              key={index}
              header={
                <div className='w-full flex gap-5 items-center justify-between pr-4 py-3 px-4 bg-gray-100 rounded-md transition duration-300 hover:bg-gray-200'>
                  <div className='flex items-center gap-3'>
                    <div className="p-2 bg-blue-100 rounded-md flex items-center justify-center">
                      <FileUploadIcon color='blue' />
                    </div>

                    <a href={certificate.url} target="_blank" rel="noopener noreferrer" className='ml-2 text-gray-800 font-medium'>
                      <span className='font-semibold text-gray-800'>{certificate.archivo_nombre}</span>
                    </a>

                  </div>
                  <div className='flex'>
                    <div className='flex flex-col items-end text-gray-600 text-xs font-extralight'>

                    </div>
                  </div>
                </div>
              }
            >

            </Accordion.Panel>
          ))}
      </Accordion>


      <CertificateModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} cedula={cedula} />
    </div>
  );
}
