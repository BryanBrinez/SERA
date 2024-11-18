import React, { useState, useEffect } from 'react';
import { TagPicker } from 'rsuite';
import axios from 'axios';

export const SelectTagProgram = ({ onChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('hola');
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/program`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let programs_list = response.data;
        console.log('Programs:', programs_list);

        // Formatear los datos para el TagPicker
        const formattedData = programs_list.map(item => ({
          label: `${item.nombre_programa} - ${item.codigo}`,
          value: item.codigo
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error al cargar los programas:', err.response ? err.response.data : err.message);
        setError('Error al cargar los programas');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Manejador de cambio que convierte valores seleccionados a un array de strings
  const handleChange = (values) => {
    onChange(values); 
  };

  return (
    <TagPicker
      data={data}
      onChange={handleChange}
      placeholder={loading ? 'Cargando...' : error ? 'Error al cargar' : 'Seleccionar programa(s)'}
      block
      disabled={loading || !!error}
    />
  );
};