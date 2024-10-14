import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "rsuite";
import { useRouter } from "next/navigation";

export default function CoursesByProfesor({ profesorCode }) {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]); // Estado para cursos filtrados
    const [loading, setLoading] = useState(true); // Mantén loading en true inicialmente
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const router = useRouter();

    const fetchCoursesByProfesor = async (profesorCode) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course`);
            const filteredCourses = response.data.filter(course => course.Profesor === profesorCode);
            setCourses(filteredCourses);
            setLoading(false); // Cambia el estado a false cuando se cargan los cursos
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false); // Cambia loading a false en caso de error
        }
    };

    useEffect(() => {
        fetchCoursesByProfesor(profesorCode);
    }, [profesorCode]);

    // Filtrar cursos cuando el término de búsqueda cambie
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCourses(courses); // Mostrar todos los cursos si no hay término de búsqueda
        } else {
            const filtered = courses.filter(course =>
                course.nombre_curso.toLowerCase().includes(searchTerm.toLowerCase()) || 
                course.codigo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [searchTerm, courses]);

    return (
        <div>
            {/* Barra de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar curso por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {
                    loading ? (
                        // Muestra los skeletons durante el tiempo que loading es true
                        Array(6).fill(0).map((_, idx) => (
                            <div
                                key={idx}
                                className="animate-pulse flex flex-col py-3 px-5 gap-3 bg-gray-100 rounded-lg min-w-[180px]"
                            >
                                <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                                <div className="h-10 bg-gray-200 animate-pulse rounded mt-4"></div>
                            </div>
                        ))
                    ) : (
                        filteredCourses.length > 0 ? (
                            // Muestra las tarjetas con datos reales una vez termine el skeleton
                            filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className={'flex flex-col py-3 px-5 gap-3 bg-white shadow-sm rounded-lg min-w-[180px] border'}
                                >
                                    <div className="">
                                        <p className="text-lg font-semibold text-gray-800 mb-2">{course.nombre_curso}</p>
                                        <p className="text-gray-600"><strong>Código:</strong> {course.codigo}</p>
                                        <p className="text-gray-600"><strong>Grupo:</strong> {course.grupo}</p>
                                    </div>
                                    <div className="">
                                        <Button
                                            style={styles}
                                            type="submit"
                                            color="red"
                                            appearance="primary"
                                            className="w-full"
                                            onClick={() => router.push(`/home/cursos/${course.id}`)}
                                        >
                                            Ir al curso
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <></>
                        )
                    )
                }
            </div>
        </div>
    );
}

const styles = {
    backgroundColor: '#c62120',
    color: 'white',
    transition: 'width 0.1s ease-in-out',
    fontWeight: 'bold',
    width: '100%',
};
