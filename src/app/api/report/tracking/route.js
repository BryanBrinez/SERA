import { NextResponse } from "next/server";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(request) {
  const url = new URL(request.url);
  const año = url.searchParams.get('año'); // Año pasado como parámetro
  const periodo = url.searchParams.get('periodo');
  const grupo = url.searchParams.get('grupo');
  const curso = url.searchParams.get('curso');

  try {
    const noteRef = collection(db, "notas");
    const noteQuery = query(
      noteRef,
      where("año", "==", año),
      where("periodo", "==", periodo),
      where("grupo", "==", parseInt(grupo)),
      where("curso", "==", curso),
    );

    const noteSnapshot = await getDocs(noteQuery);

    // Verificar si no se encontraron documentos
    if (noteSnapshot.empty) {
      return new Response(
        JSON.stringify({ message: "Notas no encontradas" }),
        { status: 404 }
      );
    }

    const noteData = noteSnapshot.docs[0].data();

    const totalEstudiantes = noteData.estudiantes.length; // Cantidad total de estudiantes

    // Estructura para almacenar las notas procesadas
    const tabla = {};

    noteData.estudiantes.forEach((estudiante) => {
      estudiante.notas.forEach((nota) => {
        const nombreNota = nota.nombre_nota;
        const codigosIndicadores = nota.codigos_indicadores || [];
        const calificacion = nota.calificacion;

        // Inicializar la entrada si no existe
        if (!tabla[nombreNota]) {
          tabla[nombreNota] = {
            tipo_evaluacion: nombreNota,
            resultado_aprendizaje: codigosIndicadores,
            estudiantes_presentaron: 0,
            estudiantes_no_presentaron: 0,
            estudiantes_aprobaron: 0, // N° de estudiantes que aprobaron
            estudiantes_reprobaron: 0, // N° de estudiantes que reprobaron
          };
        }

        // Lógica: calificación 0 es "no presentó", cualquier otro valor es "presentó"
        if (calificacion === 0) {
          tabla[nombreNota].estudiantes_no_presentaron += 1;
        } else {
          tabla[nombreNota].estudiantes_presentaron += 1;

          // Calcular aprobados y reprobados
          if (calificacion >= 3) {
            tabla[nombreNota].estudiantes_aprobaron += 1; // Aprobados
          } else {
            tabla[nombreNota].estudiantes_reprobaron += 1; // Reprobados
          }
        }
      });
    });

    // Convertir la tabla en un arreglo y calcular los porcentajes
    const resultadoTabla = Object.values(tabla).map((row) => {
      const porcentajeENP =
        (row.estudiantes_no_presentaron / totalEstudiantes) * 100;
      const porcentajeER =
        (row.estudiantes_reprobaron / totalEstudiantes) * 100;

      return {
        ...row,
        porcentaje_ENP: parseFloat(porcentajeENP.toFixed(2)), // % ENP
        porcentaje_ER: parseFloat(porcentajeER.toFixed(2)), // % ER
      };
    });

    return new Response(JSON.stringify(resultadoTabla));
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}