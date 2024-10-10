import React, { useState, useEffect } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Button,useToaster } from "rsuite";
import Papa from 'papaparse';


export default function NotesSheet() {
    const toaster = useToaster();
    const [loading, setLoading] = useState(false);
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const initialData = Array.from({ length: 20 }, () =>
        alphabet.map(() => ({ value: '' }))
    );

    const [data, setData] = useState(initialData);
    const [importedData, setImportedData] = useState([]);

    useEffect(() => {
        const cachedData = localStorage.getItem('notesData');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            const headers = Object.keys(parsedData[0]);
            const formattedHeaders = headers.map(header => header.toUpperCase().replace(/_/g, ' '));
            const rows = parsedData.map(item => headers.map(header => item[header]));
            const newData = [formattedHeaders].concat(rows).map(row => {
                const newRow = row.map(cell => ({ value: cell }));
                while (newRow.length < 26) {
                    newRow.push({ value: '' });
                }
                return newRow;
            });
            setData(newData);
        }
    }, []);

    const importCSV = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    let newData = results.data.map((row) =>
                        row.map((cell) => ({ value: cell }))
                    );

                    while (newData.length < 15) {
                        newData.push(new Array(26).fill({ value: '' }));
                    }

                    const minColumns = 26;
                    newData = newData.map(row => {
                        while (row.length < minColumns) {
                            row.push({ value: '' });
                        }
                        return row;
                    });

                    setData(newData);
                    setImportedData(results.data);
                },
                header: false,
            });
        }
    };

    const saveData = () => {
        let jsonData;
        if (importedData.length > 0) {
            const headers = importedData[0].map(header => header.toLowerCase().replace(/ /g, '_'));
            jsonData = importedData.slice(1).map((row) => {
                return headers.reduce((acc, header, index) => {
                    acc[header] = isNaN(row[index]) ? row[index] : parseFloat(row[index]);
                    return acc;
                }, {});
            });
        } else if (data.length > 0) {
            const headers = data[0].map(cell => cell.value);
            jsonData = data.slice(1).map((row) => {
                const filteredRow = row.filter(cell => cell.value !== '');
                return headers.reduce((acc, header, index) => {
                    if (filteredRow[index]) {
                        acc[header.toLowerCase().replace(/ /g, '_')] = filteredRow[index].value;
                    }
                    return acc;
                }, {});
            });
        }

        if (jsonData && jsonData.length > 0) {
            localStorage.setItem('notesData', JSON.stringify(jsonData));
            console.log("Datos guardados en caché:", JSON.stringify(jsonData, null, 2));
        } else {
            console.log("No hay datos para guardar.");
        }
    };

    return (
        <div>
            <div className="mb-4">
                <div className='flex flex-row gap-3 w-full justify-end'> 
                    <input
                        type="file"
                        accept=".csv"
                        onChange={importCSV}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-100"
                        style={{ width: 'auto', height: 'auto' }} // Ajusta el tamaño según sea necesario
                    />
                    <Button
                        style={styles}
                        type="submit"
                        color="red"
                        appearance="primary"
                        className="w-36"
                        loading={loading}
                        onClick={saveData}
                    >
                        Guardar
                    </Button>
                </div>
            </div>
            <div
                className="overflow-x-auto overflow-y-auto"
                style={{ maxHeight: '500px' }}
            >
                <Spreadsheet data={data} />
            </div>
        </div>
    );
}

const styles = {
    backgroundColor: '#c62120',
    color: 'white',
    transition: 'width 0.1s ease-in-out',
    fontWeight: 'bold',
};