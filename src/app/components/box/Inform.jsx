import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'rsuite';
import ResultsAp from '@/app/components/cards/ResultsAp';
import DownloadPDF from '../pdf/DownloadPDF';
import TableResults from '../table/TableResults';

// Función para formatear los nombres de las evaluaciones
const formatEvaluationName = (name) => {
    return name
        .replace(/_/g, ' ') // Reemplazar guiones bajos con espacios
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar cada palabra
};

export default function Inform({ course, group, profesorCode, period, year }) {
    const [resultadosAprendizaje, setResultadosAprendizaje] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [followUp, SetFollowUp] = useState([]);
    const [cursoInfo, setCursoInfo] = useState({});
    const [generalInfo, setGeneralInfo] = useState({
        curso: course,
        grupo: group,
        año: year,
        periodo: period,
        docente: profesorCode,
    });
    const [loading, setLoading] = useState(false);

    // Estado para almacenar los promedios de los resultados de aprendizaje
    const [resultadosPromedio, setResultadosPromedio] = useState([]);

    useEffect(() => {
        fetchReport();
        fetchFollowUp();
        fetchCourse();
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/report?año=${year}&periodo=${period}&grupo=${group}&curso=${course}`);
            setReportData(response.data);

            // Extraer los resultados de aprendizaje y calcular promedios
            const promedioResultados = calculatePromedios(response.data);
            console.log('data:', response.data);

            // Actualizar el estado con los promedios calculados
            setResultadosPromedio(promedioResultados);
            console.log('Promedios de resultados:', promedioResultados);

            // Extraer los resultados de aprendizaje
            const indicadores = [];
            Object.values(response.data).forEach((value) => {
                indicadores.push(...value.codigos_indicadores);
            });

            // Eliminar duplicados con Set y luego actualizar el estado
            setResultadosAprendizaje([...new Set(indicadores)]);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowUp = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/report/tracking?año=${year}&periodo=${period}&grupo=${group}&curso=${course}`);
            SetFollowUp(response.data);
        } catch (error) {
            console.error('Error fetching follow-up data:', error);
        }
    };


    const fetchCourse = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course/${course}`);
          setCursoInfo(response.data);
          
    
          console.log("esta aqui ene l fetch",response.data)
        } catch (error) {
          console.log("el errrorrrr",error)
        }
    
        console.log("el cursooooooooooooooo",course , "el codigo del cursoooooooooooooooo", generalInfo.curso)
        
      };

    // Función para calcular los promedios de los resultados de aprendizaje
    const calculatePromedios = (data) => {
        const resultPromedio = [];

        // Crear un objeto para almacenar las notas por cada resultado de aprendizaje
        const resultadosMap = {};

        // Iterar sobre las evaluaciones y asociar las notas con los resultados de aprendizaje
        Object.entries(data).forEach(([evaluation, value]) => {
            value.notas.forEach((nota, index) => {
                value.codigos_indicadores.forEach((codigo) => {
                    if (!resultadosMap[codigo]) {
                        resultadosMap[codigo] = [];
                    }
                    resultadosMap[codigo].push(nota);
                });
            });
        });

        // Calcular los promedios por cada resultado de aprendizaje
        Object.entries(resultadosMap).forEach(([codigo, notas]) => {
            const promedio = notas.reduce((sum, nota) => sum + nota, 0) / notas.length;
            resultPromedio.push({ resultado: codigo, promedio: parseFloat(promedio.toFixed(2)) });
        });

        return resultPromedio;
    };

    const getRecommendation = (average, codigosIndicadores) => {
        if (average < 3) {
            return `Los estudiantes presentan dificultades significativas en los resultados de aprendizaje (${codigosIndicadores.join(', ')}). 
            Esto indica que la mayoría no ha alcanzado las competencias esperadas en estas áreas. Se recomienda revisar los contenidos relacionados 
            y realizar actividades de refuerzo, para mejorar el entendimiento de los conceptos clave.`;
        } else if (average < 4) {
            return `El desempeño de los estudiantes en los resultados de aprendizaje (${codigosIndicadores.join(', ')}) es satisfactorio. 
            Aunque han alcanzado un nivel aceptable, aún hay margen para consolidar conocimientos. Se sugiere fomentar la participación en actividades 
            complementarias y retroalimentar puntos específicos donde se observen brechas de comprensión.`;
        } else {
            return `El desempeño en los resultados de aprendizaje (${codigosIndicadores.join(', ')}) es sobresaliente. 
            Los estudiantes han demostrado un excelente dominio de las competencias esperadas, lo que refleja un alto nivel de comprensión y aplicación. 
            Se recomienda seguir reforzando su aprendizaje con retos adicionales y actividades avanzadas para mantener su motivación y preparación.`;
        }

    };

    return (
        <div className="w-full flex flex-col p-6 gap-4">
            <div className="flex gap-3">
                <Button onClick={fetchReport} loading={loading}>
                    Generar Informe Grupal
                </Button>
                <Button>Generar Informe Individual</Button>
                <Button >


                {
                    followUp.length > 0 && (
                        <DownloadPDF
                            generalInfo={generalInfo}
                            reportData={reportData}
                            followUp={followUp}
                            resultadosAprendizaje={resultadosPromedio}
                            cantEstudiantes={followUp[0].total_estudiantes}
                            cursoInfo={cursoInfo}
                        />
                    )
                }
            </Button>

            </div>
            
            {/* Encabezado del informe */}
            <h1 className="text-2xl font-bold text-center">
                Informe Grupal de Notas por Resultados de Aprendizaje
            </h1>

            {/* Información general del curso */}
            <div className="border p-4 rounded bg-gray-50">
                <p><strong>Curso:</strong> {generalInfo.curso}</p>
                <p><strong>Grupo:</strong> {generalInfo.grupo}</p>
                <p><strong>Año:</strong> {generalInfo.año}</p>
                <p><strong>Periodo:</strong> {generalInfo.periodo}</p>
                <p><strong>Profesor:</strong> {generalInfo.docente}</p>
            </div>

            {reportData && (
                <div className="mt-6">
                    {/* Resultados del informe */}
                    <h2 className="font-semibold text-2xl mb-6 text-gray-900">Resultados del Informe</h2>
                    {Object.entries(reportData).map(([key, value]) => (
                        <div key={key} className="mb-6 p-6 rounded-lg bg-white border ">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-xl text-gray-800">
                                    {formatEvaluationName(key)} <span className="text-sm text-gray-500">(Promedio: {value.promedio.toFixed(2)})</span>
                                </h3>
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    {value.porcentaje}%
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                <strong>Resultados de Aprendizaje Asociados:</strong>
                                {value.codigos_indicadores.length > 0
                                    ? value.codigos_indicadores.join(', ')
                                    : <span className="italic text-gray-400">Ninguno</span>}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                <strong>Porcentaje de Evaluación:</strong> {value.porcentaje}%
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                                <strong>Retroalimentación:</strong>
                                <span className={`font-medium`}>
                                    {getRecommendation(value.promedio, value.codigos_indicadores)}
                                </span>
                            </div>
                        </div>
                    ))}

                    <ResultsAp codigosResultadosProps={resultadosPromedio} />
                    {
                        followUp.length > 0 && (
                            <div className="mt-6">
                                <h2 className="font-semibold text-xl mb-8">Seguimiento con un total de {followUp[0].total_estudiantes} estudiantes</h2>
                                <TableResults data={followUp} />
                            </div>
                        )
                    }

                </div>
            )}
        </div>
    );
}
