'use client';
import React, { useEffect, useState } from 'react';
import TableCourses from '../../components/TableCourses';
import { IconButton, ButtonToolbar, Notification, useToaster, Input } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import axios from 'axios';


export default function Courses() {

  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');


  const fetchPrograms = async () => {
    console.log("Fetching programs...");
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

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div>
      <h3>Gestión de cursos</h3>
      <div className='pt-14 pb-5 flex justify-end gap-3'>
        <ButtonToolbar>
          <IconButton className='shadow' icon={<PlusIcon />}>
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
    </div>
  )
}
