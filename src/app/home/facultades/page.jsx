'use client'
import React, {useState, useEffect}from 'react'
import { ButtonToolbar, IconButton, Input, Notification, useToaster } from 'rsuite'
import { FacultyModal } from '../../components/modal/FacultyModal';
import PlusIcon from '@rsuite/icons/Plus';
import TableFaculties from '../../components/table/TableFaculties';

import axios from 'axios';

export default function Page() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [searchText, setSearchText] = useState('');
  const toaster = useToaster();

  const fetchFaculties= async () => {
    console.log("Fetching programs...");
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/faculty`);
      console.log(response.data)
      setFaculties(response.data);

    } catch (error) {
      console.error('Error fetching users:', error);
      toaster.push(
        <Notification type="error" header="Error" closable>
          No se pudieron cargar las facultades. Inténtelo de nuevo más tarde.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  const handleConfirm = async (formValue) => {
    try {
      console.log('Submitting formValue:', formValue);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/faculty`, formValue, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response from server:', response);
    
      fetchFaculties();

      toaster.push(
        <Notification type="success" header="Facultad creada" closable>
          La facultad ha sido creada con éxito.
        </Notification>,
        { placement: 'topEnd' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
      console.log(error)
      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al crear la facultad. Por favor, inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  }

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    fetchFaculties();
    setIsModalOpen(false);
  };

  return (
    <div>
      <h3>Gestión de facultades</h3>
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

      <TableFaculties facultyData={faculties} searchText={searchText} />
      <FacultyModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} />
    </div>
  )
}
