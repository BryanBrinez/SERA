import React, { useState } from 'react';
import { Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

export default function TableResults({ data }) {
  const [reportData, setReportData] = useState(data);

  return (
    <div>
      <Table data={reportData} autoHeight bordered cellBordered>
        <Column flexGrow={1} resizable>
          <HeaderCell>Tipo de evaluación</HeaderCell>
          <Cell dataKey="tipo_evaluacion" />
        </Column>

        <Column flexGrow={1} resizable>
          <HeaderCell>Resultados de Aprendizaje</HeaderCell>
          <Cell>
            {rowData =>
              Array.isArray(rowData.resultado_aprendizaje)
                ? rowData.resultado_aprendizaje.join(', ')
                : rowData.resultado_aprendizaje
            }
          </Cell>
        </Column>

        <Column flexGrow={1} resizable>
          <HeaderCell>N° Estudiantes que Presentaron (EP)</HeaderCell>
          <Cell dataKey="estudiantes_presentaron" />
        </Column>

        <Column flexGrow={1} resizable>
          <HeaderCell>N° Estudiantes que No Presentaron (ENP)</HeaderCell>
          <Cell dataKey="estudiantes_no_presentaron" />
        </Column>

        <Column width={90} resizable>
          <HeaderCell>% ENP</HeaderCell>
          <Cell dataKey="porcentaje_ENP" />
        </Column>

        <Column flexGrow={1} resizable>
          <HeaderCell>N° Estudiantes que Aprobaron (EA)</HeaderCell>
          <Cell dataKey="estudiantes_aprobaron" />
        </Column>

        <Column width={90} resizable>
          <HeaderCell>% EA</HeaderCell>
          <Cell dataKey="porcentaje_EA" />
        </Column>

        <Column flexGrow={1} resizable>
          <HeaderCell>N° Estudiantes que Reprobaron (ER)</HeaderCell>
          <Cell dataKey="estudiantes_reprobaron" />
        </Column>

        <Column width={90} resizable>
          <HeaderCell>% ER</HeaderCell>
          <Cell dataKey="porcentaje_ER" />
        </Column>
      </Table>
    </div>
  );
}