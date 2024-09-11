import React, { useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import axios from 'axios';

const SelectUser = ({ onChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Filtrar usuarios con rol de 'Coordinador'
        const coordinators = response.data.filter(user => 
          Array.isArray(user.rol) && user.rol.includes('Coordinador')
        );

        // Formatear los datos para el SelectPicker
        const formattedData = coordinators.map(item => {
          const fullName = [
            item.primerNombre || '',
            item.segundoNombre || '',
            item.primerApellido || '',
            item.segundoApellido || '',
          ]
            .filter(Boolean)
            .join(' '); // Combinar partes del nombre que existen

          return { label: fullName, value: item.cedula }; // Usar cedula como 'value'
        });

        setData(formattedData);
      } catch (err) {
        console.error('Error al cargar los usuarios:', err.response ? err.response.data : err.message);
        setError('Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

export default SelectUser;
