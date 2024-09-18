import React, { useState, useEffect } from 'react';
import { TagPicker } from 'rsuite';
import axios from 'axios';

const SelectTagSede = ({ onChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/sede`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let sedes_list = response.data;

        // Verifica que sedes_list sea un array
        if (!Array.isArray(sedes_list)) {
          throw new Error('Formato inesperado de datos');
        }

        // Mapear los datos al formato esperado por TagPicker
        const formattedData = sedes_list.map(sede => ({
          label: sede.sede_nombre,
          value: sede.sede_nombre,
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error al cargar las sedes:', err.response ? err.response.data : err.message);
        setError('Error al cargar las sedes');
      } finally {
        setLoading(false);
      }
    };

    fetchSedes();
  }, []);

  // Manejador de cambio que convierte valores seleccionados a un array de strings
  const handleChange = (values) => {
    onChange(values); // `values` ya es un array de strings
  };

  return (
    <TagPicker
      data={data}
      onChange={handleChange}
      placeholder={loading ? 'Cargando...' : error ? error : 'Seleccionar sede'}
      block
      disabled={loading || !!error}
      style={{ width: '100%' }}
    />
  );
};

export default SelectTagSede;
