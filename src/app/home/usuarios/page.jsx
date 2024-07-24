'use client';
import React, { useEffect, useState } from 'react';
import { UserModal } from '../../components/UserModal';
import TableUsers from '../../components/Table';
import { IconButton, ButtonToolbar, Notification, useToaster } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const toaster = useToaster();

  //Función para obtener los usuarios de la API y guardarlos en el estado users
  const fetchUsers = async () => {
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/user`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toaster.push(
        <Notification type="error" header="Error" closable>
          No se pudieron cargar los usuarios. Inténtelo de nuevo más tarde.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //Cuando se confirma el formulario del modal realiza la petición POST
  //para crear un nuevo usuario, con los datos ingresados en el formulario
  const handleConfirm = async (formValue) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValue)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      // Volver a cargar todos los usuarios
      fetchUsers();

      toaster.push(
        <Notification type="success" header="Usuario creado" closable>
          El usuario ha sido creado con éxito.
        </Notification>,
        { placement: 'topEnd' }
      );

      handleCloseModal();
    } catch (error) {
      console.error('Error creating user:', error);

      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al crear el usuario. Por favor, inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  return (
    <section className='flex flex-col'>
      <h3>Gestión de usuarios</h3>

      <div className='flex flex-col gap-5 py-16'>
        <ButtonToolbar className='flex justify-end'>
          <IconButton 
            className='shadow' 
            icon={<PlusIcon />}
            onClick={handleOpenModal}
          >
            Añadir
          </IconButton>
        </ButtonToolbar>

        <TableUsers userData={users} />
      </div>

      <UserModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} />
    </section>
  );
}
