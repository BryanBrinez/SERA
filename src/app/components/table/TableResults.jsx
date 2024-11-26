import React , {useState} from 'react'
import { Table } from 'rsuite';


export default function TableResults({ data }) {
  const [ data, setData ] = useState( data );

  return (
    <div>
      <Table height={420} data={data}>
        <Column width={50} align="center" resizable>
          <HeaderCell>Tipo de evaluación</HeaderCell>
          <Cell dataKey="tipo_evaluacion" />
        </Column>

        <Column width={100} resizable>
          <HeaderCell>Resultados de Aprendizaje</HeaderCell>
          <Cell dataKey="resultado_aprendizaje" />
        </Column>

        <Column width={100} resizable>
          <HeaderCell>N° Estudiantes que Presentaron (EP)</HeaderCell>
          <Cell dataKey="estudiantes_presentaron" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>N° Estudiantes que No Presentaron (ENP)</HeaderCell>
          <Cell dataKey="estudiantes_no_presentaron" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>% ENP</HeaderCell>
          <Cell dataKey="porcentaje_ENP" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>N° Estudiantes que Aprobaron (EA)</HeaderCell>
          <Cell dataKey="estudiantes_aprobaron" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>% EA</HeaderCell>
          <Cell dataKey="porcentaje_EA" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>N° Estudiantes que Reprobaron (ER)</HeaderCell>
          <Cell dataKey="estudiantes_reprobaron" />
        </Column>
        <Column width={100} resizable>
          <HeaderCell>% ER</HeaderCell>
          <Cell dataKey="porcentaje_ER" />
        </Column>
      </Table>
    </div>
  )
}
