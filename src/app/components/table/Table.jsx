'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Loader, Notification, useToaster, SelectPicker, TagPicker, Input } from 'rsuite';
import { IoSave, IoPencil, IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

const { Column, HeaderCell, Cell } = Table;

// Componente EditableCell para celdas editables
const EditableCell = ({ rowData, dataKey, onChange, onClick, ...props }) => {
  const editing = rowData.status === 'EDIT';
  const handleChange = (value) => {
    onChange(rowData.id, dataKey, value);
  };

  if (editing) {
    if (dataKey === 'estado') {
      return (
        <Cell {...props} style={styles.cell}>
          <SelectPicker
            data={[
              { label: 'Activo', value: 'Activo' },
              { label: 'Inactivo', value: 'Inactivo' },
            ]}
            searchable={false}
            style={{ width: '100%', overflow: 'hidden' }}
            placeholder="Estado"
            value={rowData[dataKey]}
            onChange={handleChange}
          />
        </Cell>
      );
    } else if (dataKey === 'programa_asignado') {
      return (
        <Cell {...props} style={styles.cell}>
          <TagPicker
            data={[
              { label: 'Ingeniería de Sistemas', value: 'Ingeniería de Sistemas' },
              { label: 'Ingeniería en Alimentos', value: 'Ingeniería en Alimentos' },
              { label: 'Contaduría Pública', value: 'Contaduría Pública' },
              { label: 'Administración de Empresas', value: 'Administración de Empresas' },
              { label: 'Dietetica y Nutrición', value: 'Dietetica y Nutrición' },
            ]}
            style={{ width: '100%', overflow: 'hidden' }}
            placeholder="Programas"
            value={rowData[dataKey]}
            onChange={handleChange}
          />
        </Cell>
      );
    } else if (dataKey === 'sede') {
      return (
        <Cell {...props} style={styles.cell}>
          <TagPicker
            data={[
              { label: 'Tuluá', value: 'Tuluá' },
            ]}
            style={{ width: '100%', overflow: 'hidden' }}
            placeholder="Sedes"
            value={rowData[dataKey]}
            onChange={handleChange}
          />
        </Cell>
      );
    } else if (dataKey === 'rol') {
      return (
        <Cell {...props} style={styles.cell}>
          <TagPicker
            data={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Coordinador', value: 'Coordinador' },
              { label: 'Auxiliar', value: 'Auxiliar' },
              { label: 'Profesor', value: 'Profesor' },
            ]}
            style={{ width: '100%', overflow: 'hidden' }}
            placeholder="Roles"
            value={rowData[dataKey]}
            onChange={handleChange}
          />
        </Cell>
      );
    }
  }

  return (
    <Cell {...props} style={styles.cell}>
      {editing ? (
        <input
          style={styles.input}
          defaultValue={rowData[dataKey]}
          onChange={(e) => handleChange(e.target.value)}
        />
      ) : (
        <span
          style={styles.span}
          onClick={() => onClick(rowData)} // Pasa rowData a la función onClick
        >
          {Array.isArray(rowData[dataKey]) ? rowData[dataKey].join(', ') : rowData[dataKey]}
        </span>
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
const updateUser = async (userId, userData) => {
  try {
    const { status, ...dataToUpdate } = userData;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}api/user/${userId}?searchBy=uid`, {
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
export default function TableUsers({ userData, searchText }) {
  const [data, setData] = useState(userData);
  const toaster = useToaster();
  const router = useRouter();

  useEffect(() => {
    setData(userData);
  }, [userData]);

  const handleChange = useCallback((id, key, value) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  }, []);

  const openUser = (id) => {
    if (id) {
      router.push(`/home/usuarios/${id}`);
    } else {
      console.error("ID del usuario es undefined.");
    }
  };

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
            wordWrap={'keep-all'}
            height={600}  // Ajusta el alto fijo de la tabla
            data={filteredData}  // Usa los datos filtrados
            rowStyle={getRowStyle}
            bordered
            cellBordered
            rowHeight={34}
            fillHeight
            hover
          >
            {/* Columnas de la tabla */}
            {/* <Column width={90}>
              <HeaderCell>Codigo</HeaderCell>
              <EditableCell dataKey="codigo" onChange={handleChange} />
            </Column> */}
            <Column width={120} resizable>
              <HeaderCell>Cédula</HeaderCell>
              <EditableCell dataKey="cedula" onChange={handleChange} onClick={(rowData) => openUser(rowData.cedula)} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Nombre 1</HeaderCell>
              <EditableCell dataKey="primerNombre" onChange={handleChange} />
            </Column>
            <Column width={110} resizable>
              <HeaderCell>Nombre 2</HeaderCell>
              <EditableCell dataKey="segundoNombre" onChange={handleChange} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Apellido 1</HeaderCell>
              <EditableCell dataKey="primerApellido" onChange={handleChange} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Apellido 2</HeaderCell>
              <EditableCell dataKey="segundoApellido" onChange={handleChange} />
            </Column>
            
            <Column width={300} resizable>
              <HeaderCell>Correo</HeaderCell>
              <EditableCell dataKey="correo" onChange={handleChange} />
            </Column>
            <Column width={130} resizable>
              <HeaderCell>Celular</HeaderCell>
              <EditableCell dataKey="celular" onChange={handleChange} />
            </Column>
            <Column width={140} resizable>
              <HeaderCell>Sede</HeaderCell>
              <EditableCell dataKey="sede" onChange={handleChange} />
            </Column>
            <Column width={300} resizable>
              <HeaderCell>Programa</HeaderCell>
              <EditableCell  dataKey="programa_asignado" onChange={handleChange} />
            </Column>
            <Column width={200} resizable>
              <HeaderCell>Rol</HeaderCell>
              <EditableCell dataKey="rol" onChange={handleChange} />
            </Column>
            <Column width={90} resizable>
              <HeaderCell>Estado</HeaderCell>
              <EditableCell dataKey="estado" onChange={handleChange} />
            </Column>
            <Column width={100} resizable >
              <HeaderCell>Acciones</HeaderCell>
              <ActionCell onClick={handleEditState} onCancel={handleCancelEdit} />
            </Column>
          </Table>
          {/* Comentado por no usar paginación */}
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