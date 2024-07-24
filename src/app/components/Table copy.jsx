'use client';
import { Table, Pagination } from 'rsuite';
import React from 'react';

const { Column, HeaderCell, Cell } = Table;

export default function TableUsers({ userData }) {
  const [limit, setLimit] = React.useState(10); // Establecer un valor predeterminado para el límite de paginación
  const [page, setPage] = React.useState(1);

  // Asegúrate de que userData sea un array
  const defaultData = Array.isArray(userData) ? userData : [];

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  // Calcula los datos a mostrar en la tabla según la paginación
  const data = defaultData.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <Table height={500} data={data}>
        <Column width={100} align="center" fixed>
          <HeaderCell>Codigo</HeaderCell>
          <Cell dataKey="codigo" />
        </Column>
        <Column width={100}>
          <HeaderCell>Primer Nombre</HeaderCell>
          <Cell dataKey="primerNombre" />
        </Column>
        <Column width={100}>
          <HeaderCell>Segundo Nombre</HeaderCell>
          <Cell dataKey="segundoNombre" />
        </Column>
        <Column width={100}>
          <HeaderCell>Primer Apellido</HeaderCell>
          <Cell dataKey="primerApellido" />
        </Column>
        <Column width={100}>
          <HeaderCell>Segundo Apellido</HeaderCell>
          <Cell dataKey="segundoApellido" />
        </Column>
        <Column width={100}>
          <HeaderCell>Cedula</HeaderCell>
          <Cell dataKey="cedula" />
        </Column>
        <Column width={100} flexGrow={1}>
          <HeaderCell>Correo</HeaderCell>
          <Cell dataKey="correo" />
        </Column>
        <Column width={100}>
          <HeaderCell>Celular</HeaderCell>
          <Cell dataKey="celular" />
        </Column>
        <Column width={100}>
          <HeaderCell>Sede</HeaderCell>
          <Cell dataKey="sede" />
        </Column>
        <Column width={100}>
          <HeaderCell>Programa</HeaderCell>
          <Cell dataKey="programa_asignado" />
        </Column>
        <Column width={100}>
          <HeaderCell>Rol</HeaderCell>
          <Cell dataKey="rol" />
        </Column>
        <Column width={100}>
          <HeaderCell>Estado</HeaderCell>
          <Cell dataKey="estado" />
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
          total={defaultData.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
}