import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ResultsAp({ codigosResultadosProps }) {
    const [resultadosAprendizaje, setResultadosAprendizaje] = useState([]);
    const [loading, setLoading] = useState(false);

    

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/resultadoaprendizaje`);
            console.log('Códigos de resultados en props:', codigosResultadosProps);
            console.log('Datos de la API:', response.data);
    
            // Extraer los códigos de los objetos en codigosResultadosProps y mapearlos a un objeto clave-valor para fácil acceso
            const promedioMap = codigosResultadosProps.reduce((acc, item) => {
                acc[item.resultado] = item.promedio; // mapeamos el código de resultado al promedio
                return acc;
            }, {});
    
            // Filtrar los resultados de aprendizaje para que solo se guarden los que coinciden con los códigos en resultCodes
            const filteredResults = response.data
                .filter(result => promedioMap[result.codigo]) // Solo consideramos los resultados cuyo código existe en las props
                .map(result => ({
                    ...result,
                    promedio: promedioMap[result.codigo] // Añadimos el promedio correspondiente al resultado
                }));
    
            // Guardar los resultados filtrados con el promedio en el estado
            setResultadosAprendizaje(filteredResults);
    
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [codigosResultadosProps]);

    // Función para determinar el color según el porcentaje
    const getCircleColor = (porcentaje) => {
        if (porcentaje < 60) {
            return "#880909"; // Menor a 60% -> Rojo
        } else if (porcentaje < 80) {
            return "#f7bc04"; // Menor a 80% -> Amarillo
        } else {
            return "#00610a"; // Mayor o igual a 80% -> Verde
        }
    };

    return (
        <div>
            <h2 className="font-semibold text-xl mb-3">Resultados de Aprendizaje implementados en el curso</h2>
            {loading ? (
                <p>Cargando resultados de aprendizaje...</p>
            ) : (
                <div className="mt-6">
                    {/* Resultados de Aprendizaje */}
                    <div className="flex flex-wrap ">
                        {resultadosAprendizaje.length > 0 ? (
                            resultadosAprendizaje.map((resultado, index) => {
                                // Calcular el porcentaje de cumplimiento basado en el promedio del resultado
                                const max = 5.0; // Valor máximo posible
                                const porcentaje = (resultado.promedio / max) * 100; // Calcular el porcentaje

                                // Determinar el color del círculo según el porcentaje
                                const circleColor = getCircleColor(porcentaje);

                                return (
                                    <div
                                        key={index}
                                        className="bg-white border rounded-xl overflow-hidden w-80 p-6 m-3 shadow "
                                    >
                                        {/* Código del Resultado */}
                                        <div className="font-semibold text-xl text-gray-800 mb-4">
                                            {resultado.codigo}
                                        </div>

                                        {/* Gráfica de Progreso Circular */}
                                        <div className="flex justify-center items-center mb-6">
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex justify-center items-center shadow-lg">
                                                <CircularProgressbar
                                                    value={porcentaje}
                                                    text={`${porcentaje.toFixed(1)}%`}
                                                    background
                                                    backgroundPadding={6}
                                                    styles={buildStyles({
                                                        backgroundColor: circleColor, // Cambiar color de fondo según el porcentaje
                                                        textColor: "#fff", // Color del texto dentro
                                                        pathColor: "#fff", // Color del borde
                                                        trailColor: "transparent", // Color del borde exterior
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Nombre del Resultado */}
                                        <div className="text-lg font-medium text-gray-900 mb-2">
                                            {resultado.nombre_resultado}
                                        </div>

                                        {/* Descripción del Resultado */}
                                        <div className="text-sm text-gray-700">
                                            {resultado.descripcion}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500 w-full">No se encontraron resultados de aprendizaje.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
