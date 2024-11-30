import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PDFDocument({ generalInfo, reportData, followUp, resultadosAprendizaje, cantEstudiantes, cursoInfo }) {
  const [followState, setFollowState] = useState(followUp);
  const [resultados, setResultados] = useState([]);

  console.log("informacion del cursoOOOOOOOOOOOOOOOOOOOOOOOO", cursoInfo)

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

  // const fetchResults = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/resultadoaprendizaje`);
  //     console.log('Códigos de resultados en props:', resultadosAprendizaje); // Verifica la estructura de los datos de entrada
  //     console.log('Datos de la API:', response.data); // Datos obtenidos de la API

  //     // Mapeamos los resultados que tenemos en `resultadosAprendizaje` para tener fácil acceso a los códigos y promedios
  //     const resultadoMap = resultadosAprendizaje.reduce((acc, item) => {
  //       acc[item.resultado] = item.promedio; // Mapeamos el código de resultado al promedio
  //       return acc;
  //     }, {});

  //     // Filtrar los resultados de la API para que solo se guarden los que coinciden con los códigos en `resultadoMap`
  //     const filteredResults = response.data
  //       .filter(result => resultadoMap[result.codigo]) // Filtramos solo los que tienen un código coincidente
  //       .map(result => ({
  //         ...result,
  //         promedio: resultadoMap[result.codigo] // Añadimos el promedio correspondiente al resultado
  //       }));

  //     // Guardamos los resultados filtrados con el promedio en el estado
  //     console.log
  //     setResultados(filteredResults);

  //   } catch (error) {
  //     console.error('Error fetching report data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchResults();
  // }, [resultadosAprendizaje]);


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
        <Text style={{ textAlign: 'center', marginBottom: '12px' }}>{formatDate()}</Text>

        {/* Información General */}
        <Text style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '20px' }}>Seguimiento a los Resultados de aprendizaje</Text>
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
              <Text>{cantEstudiantes}</Text>
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
              <Text>{cursoInfo.nombre_curso}</Text>
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
              <Text>{cursoInfo.codigo_programa}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>Créditos de la Asignatura</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{cursoInfo.creditos}</Text>
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
            <Text style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '20px' }}>Conceptos a evaluar</Text>
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

      <View style={styles.resultContainer}>
            <Text style={styles.bold}>Resultados de Aprendizaje Implementados:</Text>
            {resultadosAprendizaje && resultadosAprendizaje.length > 0 && resultadosAprendizaje.map((resultado, index) => {
                // Calcular el porcentaje basado en el promedio
                const max = 5.0; // Valor máximo posible
                const porcentaje = (resultado.promedio / max) * 100;
                const circleColor = getCircleColor(porcentaje); // Determinar el color del círculo

                return (
                    <View key={index} style={styles.resultBox}>
                        {/* Círculo de progreso */}
                        <View style={[styles.progressCircle, { backgroundColor: circleColor }]}>
                            <Text style={{ color: '#fff'}}>
                                {porcentaje.toFixed(1)}%
                            </Text>
                        </View>

                        {/* Detalles del resultado de aprendizaje */}
                        <View style={{display:'flex', flexDirection:'column', flexWrap:'wrap', overflow:'hidden'}}>
                            <Text style={styles.resultTitle}>{resultado.nombre_resultado}</Text>
                            <Text>{resultado.descripcion}</Text>
                            <Text style={''}>Código: {resultado.codigo}</Text>
                            <Text style={''}>Promedio: {resultado.promedio}</Text>
                        </View>
                    </View>
                );
            })}
        </View>

        {/* Resultados del Reporte */}
        <Text style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '20px' }}>Desglose de evaluaciones</Text>
        {reportData && Object.entries(reportData).map(([key, value]) => (
          <View key={key} style={styles.card}>
            <Text style={styles.cardTitle}>
              {key.replace(/_/g, ' ')} (Promedio: {value.promedio.toFixed(2)})
            </Text>
            <Text style={styles.cardContent}>
              <Text style={styles.label}>Resultados de Aprendizaje Asociados:</Text> {value.codigos_indicadores.join(', ') || 'Ninguno'}
            </Text>
            <Text style={styles.cardContent}>
              <Text style={styles.label}>Porcentaje de Evaluación:</Text> {value.porcentaje}%
            </Text>
            <Text style={styles.cardContent}>
              <Text style={styles.label}>Retroalimentación:</Text> {value.recomendacion}
            </Text>
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
    width: 45,
    height: 45,
    borderRadius: 10, // Hace que sea perfectamente circular
    backgroundColor: 'lightgray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#cfcfcf',
    borderRadius: 1,
    backgroundColor: '#fdfdfd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3, // Para Android
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#444',
  },
  resultContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  resultBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eaeaea',
    gap: 5,
    padding: 5,
  },
});
