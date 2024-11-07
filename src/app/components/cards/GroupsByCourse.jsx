import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "rsuite";
import { useRouter } from "next/navigation";

export default function GropusByProgram({ courseCode }) {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const fetchGropusByProgram = async (courseCode) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/group/groupsByCourse/${courseCode}`);
            setGroups(response.data);
            setFilteredGroups(response.data); // Muestra todos los grupos inicialmente
            setLoading(false);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGropusByProgram(courseCode);
    }, [courseCode]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredGroups(groups);
        } else {
            const filtered = groups.filter(group => {
                const profesor = group.Profesor ? group.Profesor.toString().toLowerCase() : '';
                const grupo = group.grupo ? group.grupo.toString().toLowerCase() : '';

                return profesor.includes(searchTerm.toLowerCase()) || grupo.includes(searchTerm.toLowerCase());
            });
            setFilteredGroups(filtered);
        }
    }, [searchTerm, groups]);

    return (
        <div>
            {/* Barra de búsqueda */}
            <div className="mt-4 mb-4 ">
                <input
                    type="text"
                    placeholder="Buscar grupo por nombre del profesor o numero del grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {
                    loading ? (
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
                        filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex flex-col py-3 px-5 gap-3 bg-white shadow-sm rounded-lg min-w-[180px] border"
                                >
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800 mb-2">{group.grupo}</p>
                                        <p className="text-gray-600"><strong>Profesor:</strong> {group.Profesor}</p>
                                        <p className="text-gray-600"><strong>Jornada:</strong> {group.jornada}</p>
                                        <p className="text-gray-600"><strong>Periodo:</strong> {group.periodo}</p>
                                        <p className="text-gray-600"><strong>Año:</strong> {group.año}</p>
                                    </div>
                                    <div>
                                        <Button
                                            style={styles}
                                            color="red"
                                            appearance="primary"
                                            className="w-full"
                                            onClick={() => router.push(`/home/cursos/${courseCode}/${group.grupo}-${group.año}-${group.periodo}`)}
                                        >
                                            Ir al grupo
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron grupos.</p>
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