'use client';
import React, { useEffect, useState } from 'react';
import { UserModal } from '../../components/modal/UserModal';
import TableUsers from '../../components/Table';
import { IconButton, ButtonToolbar, Notification, useToaster, Input } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import axios from 'axios';

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const toaster = useToaster();

  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`);
      setUsers(response.data);
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchUsers();
    setIsModalOpen(false);
  };

  const handleConfirm = async (formValue) => {
    try {
      console.log('Submitting formValue:', formValue);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/register`, formValue, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response from server:', response);
      fetchUsers();

      toaster.push(
        <Notification type="success" header="Usuario creado" closable>
          El usuario ha sido creado con éxito.
        </Notification>,
        { placement: 'topEnd' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);

      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al crear el usuario. Por favor, inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Gestión de usuarios</h3>
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

      <TableUsers userData={users} searchText={searchText} />
      <UserModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} />
    </div>
  );
}
