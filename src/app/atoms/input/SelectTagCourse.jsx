import React, { useState, useEffect } from 'react';
import { TagPicker } from 'rsuite';
import axios from 'axios';

const SelectTagCourse = ({ onChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response.data); // Verifica la estructura de los datos

        let course_list = response.data;

        // Verifica que sedes_list sea un array
        if (!Array.isArray(course_list)) {
          throw new Error('Formato inesperado de datos');
        }

        // Mapear los datos al formato esperado por TagPicker
        const formattedData = course_list.map(course => ({
          label: `${course.nombre_curso} - ${course.codigo}`,
          value: course.codigo,
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error al cargar los cursos:', err.response ? err.response.data : err.message);
        setError('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Manejador de cambio que convierte valores seleccionados a un array de strings
  const handleChange = (values) => {
    onChange(values); // `values` ya es un array de strings
  };

  return (
    <TagPicker
      data={data}
      onChange={handleChange}
      placeholder={loading ? 'Cargando...' : error ? error : 'Seleccionar'}
      block
      disabled={loading || !!error}
    />
  );
};

export default SelectTagCourse;
