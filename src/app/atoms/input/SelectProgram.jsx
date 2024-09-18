import React, { useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import axios from 'axios';

const SelectProgram = ({ onChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/program`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let programs_list = response.data;

        // Formatear los datos para el SelectPicker
        const formattedData = programs_list.map(program => {
          const label = `${program.nombre_programa} - ${program.codigo}`; // Combinar nombre_programa y codigo
          return { label: label, value: program.nombre_programa}; // Usar codigo como 'value'
        });

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

  return (
    <SelectPicker
      data={data}
      onChange={onChange} 
      placeholder={loading ? 'Cargando...' : error ? 'Error al cargar' : 'Seleccionar'}
      block
      disabled={loading || !!error}
    />
  );
};

export default SelectProgram;
