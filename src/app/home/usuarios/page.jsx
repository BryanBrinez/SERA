'use client';
import React, { useEffect, useState } from 'react';
import { UserModal } from '../../components/UserModal';
import TableUsers from '../../components/Table';
import { IconButton, ButtonToolbar, Notification, useToaster } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import axios from 'axios';

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const toaster = useToaster();
//const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`);
  //Función para obtener los usuarios de la API y guardarlos en el estado users
  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      // Añadir un parámetro único para evitar problemas de caché
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`);
      const data = response.data;
      console.log("Fetched data:", data);
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

  

  const handleOpenModal = () => {
    console.log(users, "la users ahdn")
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchUsers();
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
  useEffect(() => {
    console.log(users, "la users fetc")
    fetchUsers();
  }, []);

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
      <div>
        <h4>Lista de Usuarios</h4>
        {users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <div>
                  <strong>ID:</strong> {user.id}
                </div>
                <div>
                  <strong>Nombre:</strong> {user.cedula}
                </div>
                <div>
                  <strong>Correo:</strong> {user.correo}
                </div>
                {/* Agrega más campos según sea necesario */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios disponibles.</p>
        )}
      </div>
      <UserModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} />
    </section>
  );
}
