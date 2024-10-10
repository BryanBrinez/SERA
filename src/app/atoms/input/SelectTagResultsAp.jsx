import React, { useState, useEffect } from 'react';
import { TagPicker } from 'rsuite';
import axios from 'axios';

export const SelectTagResultsAp = ({ onChange, course }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]); // Estado para los valores seleccionados
  const [noAplicaSelected, setNoAplicaSelected] = useState(false); // Estado para "No aplica"

  useEffect(() => {
    const fetchResultsAp = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/resultadoaprendizaje`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let results_list = response.data;

        // Filtrar por 'codigo_curso' igual a 'curso' recibido por props
        const filteredResults = results_list.filter(item => item.codigo_curso === course);

        // Formatear los datos para el TagPicker
        const formattedData = filteredResults.map(item => ({
          label: `${item.nombre_resultado} - ${item.codigo}`,
          value: item.codigo,
        }));

        // Agregar la opción "No aplica" al inicio
        formattedData.unshift({ label: 'No aplica', value: 'N/A' });

        setData(formattedData);
      } catch (err) {
        console.error('Error al cargar los programas:', err.response ? err.response.data : err.message);
        setError('Error al cargar los programas');
      } finally {
        setLoading(false);
      }
    };

    fetchResultsAp();
  }, [course]); // Agregar 'curso' como dependencia

  // Manejador de cambio que convierte valores seleccionados a un array de strings
  const handleChange = (values) => {
    // Verificar si "No aplica" está seleccionado
    const isNoAplicaSelected = values.includes('N/A');
    
    // Si "No aplica" está seleccionado, sólo seleccionar ese valor
    if (isNoAplicaSelected) {
      setSelectedValues(['N/A']);
    } else {
      setSelectedValues(values);
    }

    onChange(values);
    setNoAplicaSelected(isNoAplicaSelected); // Actualizar el estado de "No aplica"
  };

  return (
    <TagPicker
      data={data}
      value={selectedValues} // Usar el estado de valores seleccionados
      onChange={handleChange}
      placeholder={loading ? 'Cargando...' : error ? 'Error al cargar' : 'R aprendizaje'}
      block
      disabled={loading || !!error}
      style={{ width: '100%' }}
      // Desactivar las opciones si "No aplica" está seleccionado
      disabledItemValues={noAplicaSelected ? data.filter(item => item.value !== 'N/A').map(item => item.value) : []}
    />
  );
};
