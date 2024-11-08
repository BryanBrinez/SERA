import { NextResponse } from "next/server";
import { db } from "../firebase/config"; // Make sure to have the correct configuration
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { EvidenceSchema } from "../../types/EvidenceSchema"; // Path to the schema you defined

export async function GET(req) {
    const session = await getServerSession(authOptions);

    try {
        const { searchParams } = new URL(req.url);
        const curso = searchParams.get("curso");
        const grupo = searchParams.get("grupo");
        const periodo = searchParams.get("periodo");
        const año = searchParams.get("año");


        const evidenceCollection = collection(db, "evidence");
        let evidenceQuery = evidenceCollection;

        const queries = [];
        if (curso) {
            queries.push(where("codigo_curso", "==", curso));
        }
        if (grupo) {
            queries.push(where("grupo", "==", parseInt(grupo))); // Ensure that grupo is a number
        }
        if (periodo) {
            queries.push(where("periodo", "==", periodo)); 
        }
        if (año) {
            queries.push(where("año", "==", año)); 
        }
        if (queries.length > 0) {
            evidenceQuery = query(evidenceCollection, ...queries);
        }

        const evidenceSnapshot = await getDocs(evidenceQuery);
        if (evidenceSnapshot.empty) {
            return new Response(JSON.stringify({ message: "No se encontraron evidencias" }), {
                status: 404,
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
        }
        const evidenceList = evidenceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return new Response(JSON.stringify(evidenceList), {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Error fetching evidencias:', error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 400,
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    }
}

export async function POST(request) {
    const evidenceData = await request.json();
    const session = await getServerSession(authOptions);

    // Check if the session is valid (optional)
    if (!session || !session.user) {
        return NextResponse.json({ message: "Acceso no autorizado" }, { status: 403 });
    }

    try {
        // Validate the evidence using Zod
        EvidenceSchema.parse(evidenceData);

        // Add the current date and time after validation
        const fecha_hora_subida = new Date();
        
        // Formatear la fecha
        const fecha = fecha_hora_subida.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
        // Formatear la hora
        const hora = fecha_hora_subida.toTimeString().split(' ')[0]; // Formato: HH:MM:SS

        const nuevaEvidencia = {
            ...evidenceData,
            fecha, // Asigna la fecha formateada
            hora,  // Asigna la hora formateada
        };

        // Create the document in Firestore
        const evidenceRef = await addDoc(collection(db, "evidence"), nuevaEvidencia);

        // Return the response for the new evidence
        return NextResponse.json({
            message: "Evidencia creada con éxito",
            id: evidenceRef.id,
        });
    } catch (error) {
        if (error.errors) {
            // Handle Zod validation errors
            return NextResponse.json({ message: error.errors }, { status: 400 });
        } else {
            // Handle other errors
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
    }
}

