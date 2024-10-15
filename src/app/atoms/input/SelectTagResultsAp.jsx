import React, { useState, useEffect } from 'react';
import { TagPicker } from 'rsuite';
import axios from 'axios';

export const SelectTagResultsAp = ({ onChange, course, resultApCodes = [] }) => { // Aseguramos que resultApCodes sea un array
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [noAplicaSelected, setNoAplicaSelected] = useState(false);

  useEffect(() => {
    const fetchResultsAp = async () => {
      setLoading(true); // Iniciar loading
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/resultadoaprendizaje`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const results_list = response.data;

        // Filtrar por 'codigo_curso'
        const filteredResults = results_list.filter(item => item.codigo_curso === course);
        console.log('RESULTADOS FILT: ', filteredResults);

        // Formatear los datos para el TagPicker
        const formattedData = [
          { label: 'No aplica', value: 'N/A' },
          ...filteredResults.map(item => ({
            label: `${item.nombre_resultado} - ${item.codigo}`,
            value: item.codigo,
          })),
        ];

        console.log(formattedData);
        setData(formattedData);

        // Inicializar selectedValues
        const initialSelectedValues = resultApCodes.includes('N/A') 
          ? ['N/A'] 
          : resultApCodes.filter(code => formattedData.some(item => item.value === code));

        setSelectedValues(initialSelectedValues);
        onChange(initialSelectedValues); // Notificar el cambio

      } catch (err) {
        console.error('Error al cargar los resultados de aprendizaje:', err.response ? err.response.data : err.message);
        setError('Error al cargar los resultados de aprendizaje');
      } finally {
        setLoading(false);
      }
    };

    fetchResultsAp();
  }, [course]); // Solo dependemos de 'course', eliminando resultApCodes para evitar bucles

  // Manejador de cambio que convierte valores seleccionados a un array de strings
  const handleChange = (values) => {
    const isNoAplicaSelected = values.includes('N/A');

    if (isNoAplicaSelected) {
      setSelectedValues(['N/A']);
      onChange(['N/A']);
    } else {
      setSelectedValues(values);
      onChange(values);
    }

    setNoAplicaSelected(isNoAplicaSelected);
  };

  return (
    <TagPicker
      data={data}
      value={selectedValues}
      onChange={handleChange}
      placeholder={loading ? 'Cargando...' : error ? 'Error al cargar' : 'R aprendizaje'}
      block
      disabled={loading || !!error}
      style={{ width: '100%' }}
      disabledItemValues={noAplicaSelected ? data.filter(item => item.value !== 'N/A').map(item => item.value) : []}
    />
  );
};
