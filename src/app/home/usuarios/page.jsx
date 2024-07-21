'use client';
import React, { useState } from 'react';
import { UserModal } from '../../components/UserModal';
import TableUsers from '../../components/Table';
import { IconButton, ButtonToolbar } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

        <TableUsers />
      </div>

      <UserModal open={isModalOpen} handleClose={handleCloseModal} />
    </section>
  );
}
