import { NextResponse } from "next/server";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  const url = new URL(request.url);
  const año = url.searchParams.get('año');  // Año pasado como parámetro
  const periodo = url.searchParams.get('periodo');
  const grupo = url.searchParams.get('grupo');
  const curso = url.searchParams.get('curso');
  /*if (
    !session || 
    !session.user || 
    !session.user.rol.some(role => ["Admin", "Coordinador", "Auxiliar", "Profesor"].includes(role))
  ) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
  }*/

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

      // Obtener los datos del primer documento que coincide
    const noteData = noteSnapshot.docs[0].data();

   // Crear un objeto para almacenar las notas agrupadas por nombre de la nota
   const notasPorNombre = {};

   // Recorrer el array de estudiantes
   noteData.estudiantes.forEach((estudiante) => {
     estudiante.notas.forEach((nota) => {
       const nombreNota = nota.nombre_nota; 
       const calificacion = nota.calificacion || 0; 

       // Si el nombre de la nota no existe en el objeto, crear un objeto vacío con la estructura inicial
       if (!notasPorNombre[nombreNota]) {
         notasPorNombre[nombreNota] = {
           codigos_indicadores: nota.codigos_indicadores || [],
           porcentaje: nota.porcentaje || 0,
           notas: [], 
           
           promedio: 0 

         };
       }
       // Agregar la calificación al array correspondiente bajo la propiedad 'notas'
       notasPorNombre[nombreNota].notas.push(calificacion);
     });
   });

   console.log("Notas agrupadas por nombre de nota:", notasPorNombre);
   for (const nombreNota in notasPorNombre) {
    const notas = notasPorNombre[nombreNota].notas;
    const promedio = notas.reduce((acc, calificacion) => acc + calificacion, 0) / notas.length;
    notasPorNombre[nombreNota].promedio = parseFloat(promedio.toFixed(2)); 
  }

  console.log("Notas agrupadas por nombre de nota con promedio:", notasPorNombre);

   return new Response(JSON.stringify(notasPorNombre));

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
