'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Loader, Notification, useToaster, SelectPicker, TagPicker, Input } from 'rsuite';
import { IoSave, IoPencil, IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import axios from 'axios';

const { Column, HeaderCell, Cell } = Table;

// Componente EditableCell para celdas editables
const EditableCell = ({ rowData, dataKey, onChange, onClick, ...props }) => {
  const editing = rowData.status === 'EDIT';
  const handleChange = (value) => {
    onChange(rowData.id, dataKey, value);
  };

  return (
    <Cell {...props} style={styles.cell}onClick={() => onClick(rowData)}>
      {editing ? (
        <input
          style={styles.input}
          defaultValue={rowData[dataKey]}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <span style={styles.span}>{Array.isArray(rowData[dataKey]) ? rowData[dataKey].join(', ') : rowData[dataKey]}</span>
      )}
    </Cell>
  );
};

// Componente ActionCell para los botones de editar/guardar y cancelar
const ActionCell = ({ rowData, onClick, onCancel, ...props }) => (
  <Cell {...props} style={styles.cell}>
    <div style={styles.iconContainer}>
      {rowData.status === 'EDIT' ? (
        <>
          <IoSave style={styles.iconSave} onClick={() => onClick(rowData)} />
          <IoClose style={styles.iconCancel} onClick={() => onCancel(rowData)} />
        </>
      ) : (
        <IoPencil style={styles.iconEdit} onClick={() => onClick(rowData)} />
      )}
    </div>
  </Cell>
);

// Función para realizar la llamada PUT al endpoint
const updateCourse = async (courseId, courseData) => {
  try {
    const { status, ...dataToUpdate } = courseData;
    
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_URL}api/course/${courseId}`,
      dataToUpdate,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(dataToUpdate)
    return response.data;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      console.error('Error de respuesta del servidor:', error.response.data);
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      console.error('Error de solicitud sin respuesta:', error.request);
    } else {
      // Algo sucedió al configurar la solicitud
      console.error('Error en la configuración de la solicitud:', error.message);
    }
    return null;
  }
};

// Componente principal
export default function TableCourse({ courseData, searchText }) {
  const [data, setData] = useState(courseData);
  const toaster = useToaster();
  const router = useRouter();

  useEffect(() => {
    setData(courseData);
  }, [courseData]);

  const handleChange = useCallback((id, key, value) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  }, []);

  const openCourse = (rowData) => {
    const { id } = rowData;
    if (id) {
      router.push(`/home/cursos/${id}`);
    } else {
      console.error("ID del curso es undefined.");
    }
  };

  const handleEditState = useCallback(async (rowData) => {
    if (rowData.status === 'EDIT') {
      const updatedCourse = data.find(item => item.id === rowData.id);
      const result = await updateCourse(rowData.id, updatedCourse);

      if (result) {
        toaster.push(
          <Notification type="success" header="Éxito" closable>
            Curso actualizado correctamente
          </Notification>,
          { placement: 'topEnd', duration: 3000 }
        );
        setData(prevData =>
          prevData.map(item =>
            item.id === rowData.id ? { ...item, status: null } : item
          )
        );
      } else {
        toaster.push(
          <Notification type="error" header="Error" closable>
            No se pudo actualizar el curso
          </Notification>,
          { placement: 'topEnd', duration: 3000 }
        );
      }
    } else {
      setData(prevData =>
        prevData.map(item =>
          item.id === rowData.id ? { ...item, status: 'EDIT' } : item
        )
      );
    }
  }, [data, toaster]);

  const handleCancelEdit = useCallback((rowData) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === rowData.id ? { ...item, status: null } : item
      )
    );
  }, []);

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText]);

  const getRowStyle = useCallback((rowData) => {
    return rowData.status === 'EDIT' ? { boxShadow: 'rgba(136, 10, 9, 0.3) 0px 0px 0px 3px' } : {};
  }, []);

  return (
    <div>
      {data.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <Table
            wordWrap
            height={600}  // Ajusta el alto fijo de la tabla
            data={filteredData}  // Usa los datos filtrados
            rowStyle={getRowStyle}
            bordered
            cellBordered
            rowHeight={34}
            affixHorizontalScrollbar
            hover
          >
            {/* Columnas de la tabla */}
            <Column width={130} resizable>
              <HeaderCell>Codigo</HeaderCell>
              <EditableCell dataKey="codigo" onChange={handleChange} onClick={openCourse}/>
            </Column>
            <Column width={300} resizable>
              <HeaderCell>Nombre</HeaderCell>
              <EditableCell dataKey="nombre_curso" onChange={handleChange} />
            </Column>
            <Column width={80} resizable>
              <HeaderCell>Grupo</HeaderCell>
              <EditableCell dataKey="grupo" onChange={handleChange} />
            </Column>
            <Column width={100} resizable>
              <HeaderCell>Jornada</HeaderCell>
              <EditableCell dataKey="jornada" onChange={handleChange} />
            </Column>
            <Column width={200} resizable>
              <HeaderCell>Programa</HeaderCell>
              <EditableCell dataKey="codigo_programa" onChange={handleChange} />
            </Column>
            
            <Column width={80} resizable>
              <HeaderCell>Creditos</HeaderCell>
              <EditableCell dataKey="creditos" onChange={handleChange} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Intensidad</HeaderCell>
              <EditableCell dataKey="intensidad_horaria" onChange={handleChange} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Validable</HeaderCell>
              <EditableCell dataKey="validable" onChange={handleChange} />
            </Column>
            <Column width={100} resizable>
              <HeaderCell>Habilitable</HeaderCell>
              <EditableCell dataKey="habilitable" onChange={handleChange} />
            </Column>
            <Column width={150} resizable>
              <HeaderCell>Prerrequisitos</HeaderCell>
              <EditableCell dataKey="prerrequisitos" onChange={handleChange} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Estado</HeaderCell>
              <EditableCell dataKey="estado" onChange={handleChange} />
            </Column>
            <Column width={150} resizable>
              <HeaderCell>Profesor</HeaderCell>
              <EditableCell dataKey="Profesor" onChange={handleChange} />
            </Column>
            <Column width={100} resizable>
              <HeaderCell>Acciones</HeaderCell>
              <ActionCell onClick={handleEditState} onCancel={handleCancelEdit} />
            </Column>
          </Table>
        </>
      )}
    </div>
  );
}

// Estilos en un objeto para una mejor organización
const styles = {
  cell: {
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    cursor: 'pointer',
    
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    padding: '6px',
    fontSize: 'inherit',
    height: '100%',
  },
  span: {
    display: 'inline-block',
    height: '100%',
    lineHeight: '1.5',
    padding: '6px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '60px', // Ajuste del ancho para acomodar ambos iconos
    justifyContent: 'space-between',
    padding: '4px',
  },
  icon: {
    fontSize: '18px',
    background: '#f0f0f0',
    width: '25px',
    color: 'red',
    height: '25px',
    padding: '4px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  iconEdit: {
    fontSize: '18px',
    background: '#f7bc04',
    width: '25px',
    color: 'black',
    height: '25px',
    padding: '4px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  iconSave: {
    fontSize: '18px',
    background: '#00610a',
    width: '25px',
    color: 'white',
    height: '25px',
    padding: '4px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  iconCancel: {
    fontSize: '18px',
    background: '#880a09',
    width: '25px',
    color: 'white',
    height: '25px',
    padding: '4px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};
