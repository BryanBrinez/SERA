import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "rsuite";
import { useRouter } from "next/navigation";

export default function CoursesByProfesor({ profesorCode }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchCoursesByProfesor = async (profesorCode) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/course`);
            const filteredCourses = response.data.filter(course => course.Profesor === profesorCode);
            setCourses(filteredCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        fetchCoursesByProfesor(profesorCode);
    }, [profesorCode]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {
                courses && courses.map((course) => (
                    <div key={course.id} className="flex flex-col py-3 px-5 gap-3 bg-white shadow-sm rounded-lg min-w-[180px] border">
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
                                loading={loading}
                                onClick={() => router.push(`/home/cursos/${course.id}`)}
                            >
                                Ir al curso
                            </Button>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

const styles = {
    backgroundColor: '#c62120',
    color: 'white',
    transition: 'width 0.1s ease-in-out',
    fontWeight: 'bold',
    width : '100%',
};
