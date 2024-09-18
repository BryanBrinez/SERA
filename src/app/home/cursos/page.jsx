'use client';
import React, { useEffect, useState } from 'react';
import { CourseModal } from '../../components/modal/CourseModal';
import TableCourses from '../../components/table/TableCourses';
import { IconButton, ButtonToolbar, Notification, useToaster, Input } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import axios from 'axios';


export default function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const toaster = useToaster();

  const fetchCourses = async () => {
    console.log("Fetching courses...");
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toaster.push(
        <Notification type="error" header="Error" closable>
          No se pudieron cargar los cursos. Inténtelo de nuevo más tarde.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  const handleConfirm = async (formValue) => {
    try {
      console.log('Submitting formValue:', formValue);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/course/register`, formValue, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response from server:', response);
    
      fetchCourses();

      toaster.push(
        <Notification type="success" header="Curso creado" closable>
          El curso ha sido creado con éxito.
        </Notification>,
        { placement: 'topEnd' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
      console.log(error)
      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al crear el curso. Por favor, inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    fetchCourses();
    setIsModalOpen(false);
  };

  return (
    <div>
      <h3>Gestión de cursos</h3>
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

      <TableCourses courseData={courses} searchText={searchText} />
      <CourseModal open={isModalOpen} handleClose={handleCloseModal} onConfirm={handleConfirm} />

    </div>
  )
}
