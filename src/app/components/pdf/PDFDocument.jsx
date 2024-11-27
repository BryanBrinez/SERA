import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useState } from 'react';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderBottom: '1px solid #ccc',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
    fontSize: '10px'

  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    paddingVertical: 4,
    fontSize: '10px'
  },
  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: 'left',
    fontSize: '10px'
  },
  bold: {
    fontWeight: 'bold',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: 'lightgray',
    marginRight: 10,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default function PDFDocument({ generalInfo, reportData, followUp, resultadosAprendizaje }) {
  const [followState, setFollowState] = useState(followUp);

  console.log("es ek resultados", resultadosAprendizaje)

  // Función para obtener el color del círculo de progreso basado en el porcentaje
  const getCircleColor = (porcentaje) => {
    if (porcentaje < 60) return "#880909"; // Rojo
    if (porcentaje < 80) return "#f7bc04"; // Amarillo
    return "#00610a"; // Verde
  };

  return (
    <Document>
      <Page style={styles.page}>
        {/* Título */}
        <Text style={styles.header}>Informe Grupal de Notas por Resultados de Aprendizaje</Text>

        {/* Información General */}
        <View style={styles.section}>
          <Text><Text style={styles.bold}>Curso:</Text> {generalInfo.curso}</Text>
          <Text><Text style={styles.bold}>Grupo:</Text> {generalInfo.grupo}</Text>
          <Text><Text style={styles.bold}>Año:</Text> {generalInfo.año}</Text>
          <Text><Text style={styles.bold}>Periodo:</Text> {generalInfo.periodo}</Text>
          <Text><Text style={styles.bold}>Profesor:</Text> {generalInfo.docente}</Text>
        </View>

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
      <Page style={styles.page}>
        {/* Tabla de Seguimiento */}
        {followState && followState.length > 0 && (
          <View style={styles.section}>

            <Text style={styles.bold}>Seguimiento de Estudiantes:</Text>
            <Text style={styles.bold}>Tipo de Evaluación: TE</Text>
            <Text style={styles.bold}>Resultados de Aprendizaje: RA</Text>
            <Text style={styles.bold}>N° Estudiantes que Presentaron: EP</Text>
            <Text style={styles.bold}>N° Estudiantes que No Presentaron ENP</Text>
            <Text style={styles.bold}>N° Estudiantes que Aprobaron: EA</Text>
            <Text style={styles.bold}>% Estudiantes que Aprobaron: % EA</Text>
            <Text style={styles.bold}>N° Estudiantes que Reprobaron: ER</Text>
            <Text style={styles.bold}>% Estudiantes que Reprobaron: % ER</Text>

            {/* Fila con la información de cada evaluación */}
            <View style={styles.table}>
              {/* Fila de encabezado */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.bold]}>TE</Text>
                <Text style={[styles.tableCell, styles.bold]}>RA</Text>
                <Text style={[styles.tableCell, styles.bold]}>EP</Text>
                <Text style={[styles.tableCell, styles.bold]}>ENP</Text>
                <Text style={[styles.tableCell, styles.bold]}>% ENP</Text>
                <Text style={[styles.tableCell, styles.bold]}>EA</Text>
                <Text style={[styles.tableCell, styles.bold]}>% EA</Text>
                <Text style={[styles.tableCell, styles.bold]}>ER</Text>
                <Text style={[styles.tableCell, styles.bold]}>% ER</Text>
              </View>
              {followState.map((evaluation, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{evaluation.tipo_evaluacion}</Text>
                  <Text style={styles.tableCell}>{evaluation.resultado_aprendizaje.join(', ')}</Text>
                  <Text style={styles.tableCell}>{evaluation.estudiantes_presentaron}</Text>
                  <Text style={styles.tableCell}>{evaluation.estudiantes_no_presentaron}</Text>
                  <Text style={styles.tableCell}>{evaluation.porcentaje_ENP}</Text>
                  <Text style={styles.tableCell}>{evaluation.estudiantes_aprobaron}</Text>
                  <Text style={styles.tableCell}>{evaluation.porcentaje_EA}</Text>
                  <Text style={styles.tableCell}>{evaluation.estudiantes_reprobaron}</Text>
                  <Text style={styles.tableCell}>{evaluation.porcentaje_ER}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
