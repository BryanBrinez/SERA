import { HyperFormula } from "hyperformula";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { useEffect, useState } from 'react';
import "handsontable/dist/handsontable.full.min.css";
import { Notification, useToaster } from 'rsuite';
import { Button } from "rsuite";
import Papa from 'papaparse';
import axios from 'axios';
import { SelectTagResultsAp } from "@/app/atoms/input/SelectTagResultsAp";

// Register Handsontable's modules
registerAllModules();

export default function HandsontableSheet({ course, group, period, year }) {
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const initialData = Array.from({ length: 20 }, () => alphabet.map(() => ''));
  const [bdDta, setBdDta] = useState([]);
  const [data, setData] = useState(initialData);
  const [importedData, setImportedData] = useState([]);
  const [selects, setSelects] = useState({}); // Almacena los selects por columna
  const [results, setResults] = useState([]); // Almacena los resultados de aprendizaje de los selects
  const [percentageSelects, setPercentageSelects] = useState({}); 
  const [dataExits, setDataExits] = useState(false);// Almacena los porcentajes seleccionados
  const [mappedData, setMappedData] = useState({
    curso: '',
    grupo: '',
    año: '',
    periodo: '',
    estudiantes: [{
      nombres: '',
      notas: [{
        nombre_nota: '',
        codigos_indicadores: [],
        calificacion: 0,
        porcentaje: 0
      }]
    }]
  });

  const fetchNotesData = async () => {
    console.log("Fetching notes...");
    console.log("Curso:", course, "Grupo:", group); // Verifica que estos valores sean correctos
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/note?curso=${course}&grupo=${group}&año=${year}&periodo=${period}`);
        
        setBdDta(response.data);
        console.log(response.data);
        setResults(response.data[0]?.codigo_resultados); // Usa el operador de encadenamiento opcional para evitar errores si response.data está vacío
        parser(response.data);
        setDataExits(true)

    } catch (error) {
        // Ignorar el error sin hacer nada
        console.error('Error fetching notes:', error.response ? error.response.data : error.message);
    }
};

  const parser = (data) => {
    console.log('DATA', data);
    // Transformación de datos
    const newData = [];

    // Inicializar encabezados
    const headers = ['CODIGO', 'NOMBRES'];

    // Recorrer el objeto para encontrar todos los nombres de notas (incluyendo duplicados)
    data.forEach(curso => {
      curso.estudiantes.forEach(estudiante => {
        estudiante.notas.forEach(nota => {
          const header = nota.nombre_nota.toUpperCase().replace(/_/g, ' '); // Convertir a mayúsculas y reemplazar _ por espacio
          if (!headers.includes(header)) { // Asegurar que el encabezado no se agregue duplicado
            headers.push(header); // Agregar nombre de nota a los encabezados
          }
        });
      });
    });

    // Agregar encabezados finales al nuevo array
    newData.push(headers); // Encabezados finales

    // Recorrer el objeto y extraer los datos necesarios
    data.forEach(curso => {
      curso.estudiantes.forEach(estudiante => {
        const row = [];
        row.push(estudiante.codigo); // Código del estudiante
        row.push(estudiante.nombre); // Nombre del estudiante

        // Inicializar las calificaciones de las notas
        const notasMap = {};
        estudiante.notas.forEach(nota => {
          notasMap[nota.nombre_nota] = nota.calificacion; // Mapear nombre de nota a calificación
        });

        // Agregar las calificaciones en el orden de los encabezados
        headers.slice(2).forEach(header => {
          // Usar el nombre original de la nota en notasMap
          const originalHeader = header.replace(/ /g, '_').toLowerCase(); // Convertir el encabezado a minúsculas y cambiar espacios a _
          row.push(notasMap[originalHeader] || null); // Si no existe la nota, agregar null
        });

        newData.push(row); // Agregar la fila al nuevo array
      });
    });
    const minColumns = 26;
    newData.map(row => {
      while (row.length < minColumns) {
        row.push('');  // Asegurarse de que haya 26 columnas
      }
      return row;
    });

    setData(newData);
    setImportedData(newData);
    console.log(newData);
  };

  useEffect(() => {
    fetchNotesData();
  }, []);

  // Función para manejar la carga del archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          let newData = results.data.map((row) =>
            row.map((cell) => cell) // Guardar cada celda directamente como un string
          );

          // Asegurarse de que haya al menos 15 filas
          while (newData.length < 15) {
            newData.push(new Array(26).fill(''));
          }

          const minColumns = 26;
          newData = newData.map(row => {
            while (row.length < minColumns) {
              row.push('');  // Asegurarse de que haya 26 columnas
            }
            return row;
          });

          setData(newData);

          setImportedData(results.data);
          console.log('Imported data:', results.data);
          updateSelects(newData);
        },
        header: false,
      });
    }
  };

  // Función para actualizar los selects basados en los datos
  const updateSelects = (data) => {
    const newSelects = {};
    data[0].forEach((_, index) => {
      if (index > 1 && data.some(row => row[index] !== '')) { // Ignorar columnas A (0) y B (1)
        newSelects[index] = ''; // Inicializa el select como vacío
      }
    });
    setSelects(newSelects);
  };

  // Función para manejar el cambio de datos
  const handleDataChange = (changes) => {
    if (changes) {
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (col > 1) { // Ignorar columnas A (0) y B (1)
          if (newValue !== '' && !(col in selects)) {
            setSelects(prev => ({ ...prev, [col]: '' })); // Agregar select para la nueva columna
          } else if (newValue === '' && col in selects) {
            // Eliminar el select si la columna queda vacía
            setSelects(prev => {
              const newSelects = { ...prev };
              delete newSelects[col];
              return newSelects;
            });
          }
        }
      });
      setData(currentData => [...currentData]); // Actualizar el estado con los datos de la tabla
    }
  };


  
  const saveNotesData = async (data) => {

    console.log("la data",data)
    try {
      let response;
      if (!dataExits) {
        console.log("la data",data)
        // Realizar el POST si dataExists es false
        response = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/note`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        toaster.push(
          <Notification type="success" header="Usuario creado" closable>
            El usuario ha sido creado con éxito.
          </Notification>,
          { placement: 'topEnd' }
        );
      } else {
        const idFetchData = bdDta[0].id
        
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_URL}api/note/${idFetchData}`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        toaster.push(
          <Notification type="success" header="Las notas se actualizaron con éxito" closable>
            El usuario ha sido actualizado con éxito.
          </Notification>,
          { placement: 'topEnd' }
        );
      }
  
      console.log('Response from server:', response);
    } catch (error) {
      console.error('Error processing user:', error.response ? error.response.data : error.message);
  
      toaster.push(
        <Notification type="error" header="Error" closable>
          Hubo un problema al procesar las notas. Por favor, inténtelo de nuevo.
        </Notification>,
        { placement: 'topEnd' }
      );
    }
  };
  


  // Manejar cambios en los selects de indicadores
  const handleResultChange = (index, value) => {
    setSelects(prev => ({ ...prev, [index]: value }));
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
    console.log("MAPPED DATA", jsonData);
    const mappedData = {
      año: year,
      periodo: period,
      curso: course,
      grupo: group, // Convertir grupo a string
      codigo_resultados: selects,
      estudiantes: jsonData.map(item => {
        const notas = Object.keys(item)
          .filter(key => key !== 'codigo' && key !== 'nombres')
          .map((key, index) => ({
            nombre_nota: key,
            codigos_indicadores: selects[index + 2] || [],
            calificacion: parseFloat(item[key]) || 0,
            porcentaje: percentageSelects[index + 2]
              ? parseFloat(percentageSelects[index + 2])
              : 0 // Convertir porcentaje a número
          }));

        return {
          nombre: item.nombres,
          codigo: String(item.codigo),
          notas: notas
        };
      })
    };

    // Eliminar el último estudiante del JSON
    if (mappedData.estudiantes.length > 0) {
      mappedData.estudiantes.pop(); // Elimina el último estudiante
    }

    saveNotesData(mappedData);

    console.log(mappedData);
  };


  // Generar un array de porcentajes de 0 a 100 en incrementos de 5
  const percentageOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  // Manejar el cambio en el select de porcentaje
  const handlePercentageChange = (index, value) => {
    setPercentageSelects(prev => ({ ...prev, [index]: value }));
  };

  const handleBlur = () => {
    // Aquí actualizas el estado cuando se pierde el foco de cualquier celda
    setData(currentData => {
      return [...currentData]; // Copia los datos y actualiza el estado
    });
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-row gap-3 w-full justify-end">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange} // Manejar la carga de archivos
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-white file:text-gray-700 hover:file:bg-gray-100"
            style={{ width: "auto", height: "auto" }} // Ajusta el tamaño según sea necesario
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
      {data.length > 0 && (
        <div className="pb-3 flex overflow-y-auto">
          <div className="flex flex-row gap-2 w-full ">
            {data[0].map((_, index) => {
              // Renderiza el componente SelectTagResultsAp para las columnas que no son A o B y que tienen datos
              if (index > 1 && data.some(row => row[index] !== '')) {
                return (
                  <div key={index} className="flex flex-col items-center gap-1 mr-2">
                    <label>{String.fromCharCode(65 + index)}</label>


                    <div className="flex items-center gap-1">
                      <div style={{ minWidth: '140px', maxWidth: '200px', overflowY: 'auto' }}>
                        <SelectTagResultsAp
                          value={selects[index] || ''} // El valor del select
                          onChange={(value) => handleResultChange(index, value)}
                          course={course}  // Actualizar el select
                          resultApCodes={results[index] || []} // Resultados de aprendizaje
                        />
                      </div>
                      <select
                        className="border border-gray-300 w-[60px] h-[35px] text-xs rounded-md"
                        value={percentageSelects[index] || ''}
                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                      >
                        <option value="">%</option>
                        {percentageOptions.map((option) => (
                          <option key={option} value={option}>{option}%</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
      <HotTable
        data={data}
        colHeaders={alphabet}
        rowHeaders={true}
        height={550}
        licenseKey="non-commercial-and-evaluation"
        // colWidths={100}
        // rowHeights={23}
        // minRows={15}
        // maxCols={26}
        maxRows={50}
        stretchH="all"
        outsideClickDeselects={false}
        onBlur={handleBlur} 
        formulas={{
          engine: HyperFormula,
        }}
        // manualColumnResize={true}
        // manualRowResize={true}
        contextMenu={true}
        afterChange={handleDataChange}
        className="handsontable"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}

const styles = {
  width: "10%",
};