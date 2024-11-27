import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { useState } from 'react';

export default function PDFDocument({ generalInfo, reportData, followUp, resultadosAprendizaje }) {
  const [followState, setFollowState] = useState(followUp);

  console.log("es ek resultados", resultadosAprendizaje)

  // Función para obtener el color del círculo de progreso basado en el porcentaje
  const getCircleColor = (porcentaje) => {
    if (porcentaje < 60) return "#880909"; // Rojo
    if (porcentaje < 80) return "#f7bc04"; // Amarillo
    return "#00610a"; // Verde
  };

  const formatDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados.
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };


  return (
    <Document>
      <Page style={styles.page}>

        <Image
          style={styles.logo}
          src="/univalle.png" // Cambia la ruta según la ubicación de tu imagen
        />
        {/* Título */}
        <Text style={styles.header}>Informe Grupal de Notas por Resultados de Aprendizaje</Text>

        {/* Título principal */}
        <Text style={styles.subHeader}>Universidad del valle - Sede Tuluá</Text>
        <Text style={{textAlign: 'center', marginBottom:'12px'}}>{formatDate()}</Text>

        {/* Información General */}
        <Text style={{ fontSize: '10px', fontWeight: 'bold' , marginTop: '20px'  }}>Seguimiento a los Resultados de aprendizaje</Text>
        <View style={styles.table}>
          {/* Fila 1 */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Sede</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{generalInfo.sede || ''}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Código Asignatura</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{generalInfo.curso}</Text>
            </View>
            <View style={styles.tableCellSpan}>
              <Text style={styles.bold}>N° Estudiantes Matriculados (EM)</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>31</Text>
            </View>
          </View>

          {/* Fila 2 */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Periodo Académico</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{generalInfo.periodo} - {generalInfo.año}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Nombre de la Asignatura</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Cálculo 1</Text>
            </View>
            <View style={styles.tableCellSpan}>
              <Text style={styles.bold}>Nombre del Docente</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{generalInfo.docente}</Text>
            </View>
          </View>

          {/* Fila 3 */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Código del Programa</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>3143</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Créditos de la Asignatura</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>3</Text>
            </View>
          </View>

          {/* Fila 4 */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Semestre</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>2</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Grupo</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{generalInfo.grupo}</Text>
            </View>
          </View>
        </View>


        {/* Tabla de Seguimiento */}
        {followState && followState.length > 0 && (

          <View style={styles.section}>
            <Text style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '20px'  }}>Conceptos a evaluar</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.bold]}>Descripción</Text>
                <Text style={[styles.tableCell, styles.bold]}>Abreviación</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Tipo de Evaluación</Text>
                <Text style={styles.tableCell}>TE</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Resultados de Aprendizaje</Text>
                <Text style={styles.tableCell}>RA</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>N° Estudiantes que Presentaron</Text>
                <Text style={styles.tableCell}>EP</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>N° Estudiantes que No Presentaron</Text>
                <Text style={styles.tableCell}>ENP</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>N° Estudiantes que Aprobaron</Text>
                <Text style={styles.tableCell}>EA</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>% Estudiantes que Aprobaron</Text>
                <Text style={styles.tableCell}>% EA</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>N° Estudiantes que Reprobaron</Text>
                <Text style={styles.tableCell}>ER</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>% Estudiantes que Reprobaron</Text>
                <Text style={styles.tableCell}>% ER</Text>
              </View>
            </View>

            {/* Fila con la información de cada evaluación */}
            <View style={styles.table}>
              {/* Fila de encabezado */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>TE</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>RA</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>EP</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>ENP</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>% ENP</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>EA</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>% EA</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>ER</Text>
                <Text style={[styles.tableCell, styles.bold, { textAlign: 'center' }]}>% ER</Text>
              </View>
              {followState.map((evaluation, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { textAlign: 'left' }]}>{evaluation.tipo_evaluacion}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'left' }]}>{evaluation.resultado_aprendizaje.join(', ')}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.estudiantes_presentaron}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.estudiantes_no_presentaron}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.porcentaje_ENP}%</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.estudiantes_aprobaron}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.porcentaje_EA}%</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.estudiantes_reprobaron}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>{evaluation.porcentaje_ER}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
      <Page style={styles.page}>

        {/* Resultados de Aprendizaje */}
        {resultadosAprendizaje && resultadosAprendizaje.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.bold}>Resultados de Aprendizaje Implementados:</Text>
            {resultadosAprendizaje.map((resultado, index) => {
              // Calcular el porcentaje basado en el promedio
              const max = 5.0; // Valor máximo posible
              const porcentaje = (resultado.promedio / max) * 100;
              const circleColor = getCircleColor(porcentaje); // Determinar el color del círculo

              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                  {/* Círculo de progreso */}
                  <View style={[styles.progressCircle, { backgroundColor: circleColor }]}>
                    <Text style={{ color: '#fff', textAlign: 'center', marginTop: '20%' }}>
                      {porcentaje.toFixed(1)}%
                    </Text>
                  </View>

                  {/* Detalles del resultado de aprendizaje */}
                  <View>
                    <Text style={styles.resultTitle}>{resultado.resultado}</Text>

                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Resultados del Reporte */}
        {reportData && Object.entries(reportData).map(([key, value]) => (
          <View key={key} style={styles.section}>
            <Text style={styles.bold}>
              {key.replace(/_/g, ' ')} (Promedio: {value.promedio.toFixed(2)})
            </Text>
            <Text>
              Resultados de Aprendizaje Asociados: {value.codigos_indicadores.join(', ') || 'Ninguno'}
            </Text>
            <Text>Porcentaje de Evaluación: {value.porcentaje}%</Text>
            <Text>Recomendación: {value.recomendacion}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  logo: {
    width: 70,
    marginBottom: 10,
    alignSelf: 'center', // Centra la imagen horizontalmente
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
    fontSize: 10,
    borderWidth: 1, // Borde externo de la tabla
    borderColor: '#cfcfcf',
  },
  tableRow: {
    flexDirection: 'row', // Organiza las celdas en una fila
    borderBottomWidth: 1, // Borde inferior entre filas
    borderBottomColor: '#cfcfcf',
  },
  tableCell: {
    flex: 1, // Distribuye uniformemente las celdas
    padding: 5,
    borderRightWidth: 1, // Borde derecho entre columnas
    borderRightColor: '#cfcfcf',
    textAlign: 'left',
  },
  tableCellSpan: {
    flex: 2, // Celdas más amplias que ocupan más espacio
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#cfcfcf',
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Hace que sea perfectamente circular
    backgroundColor: 'lightgray',
    marginRight: 10,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
