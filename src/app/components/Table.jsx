'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Pagination, Button, Loader } from 'rsuite';

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
    <Button
      style={styles.button}
      appearance="link"
      onClick={() => onClick(rowData.id)}
    >
      {rowData.status === 'EDIT' ? 'Guardar' : 'Editar'}
    </Button>
  </Cell>
);

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
  button: {
    padding: '6px',
    fontSize: 'inherit',
    border: 'none',
    background: 'none',
    color: '#880a09',
    cursor: 'pointer',
  },
};

// Componente principal
export default function TableUsers({ userData }) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(userData);

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
  const handleEditState = useCallback(id => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: item.status === 'EDIT' ? null : 'EDIT' } : item
      )
    );
  }, []);

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
          <Table height={500} data={paginatedData} rowtyle={getRowStyle}>
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
