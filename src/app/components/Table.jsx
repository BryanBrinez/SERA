'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Pagination, Loader, Notification, useToaster } from 'rsuite';
import { IoSave, IoPencil } from "react-icons/io5";

const { Column, HeaderCell, Cell } = Table;

// Componente EditableCell para celdas editables
const EditableCell = ({ rowData, dataKey, onChange, ...props }) => {
  const editing = rowData.status === 'EDIT';
  const handleChange = (event) => {
    onChange(rowData.id, dataKey, event.target.value);
  };

  return (
    <Cell {...props} style={styles.cell}>
      {editing ? (
        <input
          style={styles.input}
          defaultValue={rowData[dataKey]}
          onChange={handleChange}
        />
      ) : (
        <span style={styles.span}>{rowData[dataKey]}</span>
      )}
    </Cell>
  );
};

// Componente ActionCell para los botones de editar/guardar
const ActionCell = ({ rowData, onClick, ...props }) => (
  <Cell {...props} style={styles.cell}>
    <div
      style={styles.iconContainer}
      onClick={() => onClick(rowData)}
    >
      {rowData.status === 'EDIT' ? <IoSave style={styles.icon} /> : <IoPencil style={styles.icon} />}
    </div>
  </Cell>
);

// Función para realizar la llamada PUT al endpoint
const updateUser = async (userId, userData) => {
  try {
    // Crear una copia de userData sin el campo status
    const { status, ...dataToUpdate } = userData;
    
    const response = await fetch(`${process.env.PUBLIC_URL}api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToUpdate),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return null;
  }
};

// Componente principal
export default function TableUsers({ userData }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(userData);
  const toaster = useToaster();

  useEffect(() => {
    setData(userData);
  }, [userData]);

  // Maneja el cambio en los datos de una celda
  const handleChange = useCallback((id, key, value) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  }, []);

  // Maneja el cambio de estado de edición
  const handleEditState = useCallback(async (rowData) => {
    if (rowData.status === 'EDIT') {
      const updatedUser = data.find(item => item.id === rowData.id);
      const result = await updateUser(rowData.id, updatedUser);
  
      if (result) {
        toaster.push(
          <Notification type="success" header="Éxito" closable>
            Usuario actualizado correctamente
          </Notification>, 
          { placement: 'topEnd', duration: 3000 }
        );
        // Restablecer el estado de edición
        setData(prevData =>
          prevData.map(item =>
            item.id === rowData.id ? { ...item, status: null } : item
          )
        );
      } else {
        toaster.push(
          <Notification type="error" header="Error" closable>
            No se pudo actualizar el usuario
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

  // Calcula los datos a mostrar en la tabla según la paginación
  const paginatedData = useMemo(() => data.slice((page - 1) * limit, page * limit), [data, page, limit]);

  const handleChangeLimit = useCallback((dataKey) => {
    setPage(1);
    setLimit(dataKey);
  }, []);

  // Función para aplicar estilos a la fila basada en el estado de edición
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
          <Table height={500} data={paginatedData} rowStyle={getRowStyle}>
            {/* Columnas de la tabla */}
            <Column width={100} align="center" fixed fullText>
              <HeaderCell>Codigo</HeaderCell>
              <EditableCell dataKey="codigo" onChange={handleChange} />
            </Column>
            <Column width={80} fullText>
              <HeaderCell>Primer Nombre</HeaderCell>
              <EditableCell dataKey="primerNombre" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Segundo Nombre</HeaderCell>
              <EditableCell dataKey="segundoNombre" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Primer Apellido</HeaderCell>
              <EditableCell dataKey="primerApellido" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Segundo Apellido</HeaderCell>
              <EditableCell dataKey="segundoApellido" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Cedula</HeaderCell>
              <EditableCell dataKey="cedula" onChange={handleChange} />
            </Column>
            <Column width={100} flexGrow={2} fullText>
              <HeaderCell>Correo</HeaderCell>
              <EditableCell dataKey="correo" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Celular</HeaderCell>
              <EditableCell dataKey="celular" onChange={handleChange} />
            </Column>
            <Column width={60} fullText>
              <HeaderCell>Sede</HeaderCell>
              <EditableCell dataKey="sede" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Programa</HeaderCell>
              <EditableCell dataKey="programa_asignado" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Rol</HeaderCell>
              <EditableCell dataKey="rol" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Estado</HeaderCell>
              <EditableCell dataKey="estado" onChange={handleChange} />
            </Column>
            <Column width={100} fullText>
              <HeaderCell>Acciones</HeaderCell>
              <ActionCell onClick={handleEditState} />
            </Column>
          </Table>
          <div style={{ padding: 20 }}>
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="xs"
              layout={['total', '-', 'limit', '|', 'pager', 'skip']}
              total={data.length}
              limitOptions={[10, 30, 50]}
              limit={limit}
              activePage={page}
              onChangePage={setPage}
              onChangeLimit={handleChangeLimit}
            />
          </div>
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
    overflow: 'visible',
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '30px',
    height: '30px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '18px',
  },
};
