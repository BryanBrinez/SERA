'use client';
import React, { useEffect, useState } from 'react';
import { ProgramModal } from '../../components/modal/ProgramModal';
import TablePrograms from '../../components/TablePrograms';
import { IconButton, ButtonToolbar, Notification, useToaster, Input } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import axios from 'axios';
export default function Programs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const toaster = useToaster();


  const fetchPrograms = async () => {
    console.log("Fetching programs...");
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/program`);
      console.log(response)
      setPrograms(response.data);
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


  const handleConfirm = async (formValue) => {
    try {
      console.log('Submitting formValue:', formValue);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/program/register`, formValue, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response from server:', response);
    
      fetchPrograms();

      toaster.push(
        <Notification type="success" header="Programa creado" closable>
          El programa ha sido creado con éxito.
        </Notification>,
        { placement: 'topEnd' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
      console.log(error)
      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al crear el programa. Por favor, inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchPrograms();
    setIsModalOpen(false);
  };

  return (
    <div>
      <h3>Gestión de programas</h3>
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

      <TablePrograms programData={programs} searchText={searchText} />
      <ProgramModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} />
    </div>
  )
}
