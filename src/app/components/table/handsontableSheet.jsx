import { HyperFormula } from "hyperformula";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { useEffect, useState } from 'react';
import "handsontable/dist/handsontable.full.min.css";
import { Button } from "rsuite";
import Papa from 'papaparse';
import { SelectTagResultsAp } from "@/app/atoms/input/SelectTagResultsAp";

// Register Handsontable's modules
registerAllModules();

export default function HandsontableSheet({ course, group }) {

  const [loading, setLoading] = useState(false);
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const initialData = Array.from({ length: 20 }, () => alphabet.map(() => ''));
  const [data, setData] = useState(initialData);
  const [importedData, setImportedData] = useState([]);
  const [selects, setSelects] = useState({}); // Almacena los selects por columna
  const [percentageSelects, setPercentageSelects] = useState({}); // Almacena los porcentajes seleccionados
  const [mappedData, setMappedData] = useState({
    curso:'',
    grupo:'',
    estudiantes:[{
      nombres:'',
      notas:[{
        nombre_nota:'',
        codigos_indicadores:[],
        calificacion: 0,
        porcentaje: 0
      }]
    }
    ]

  });


  const fetchNotesData = () => {
console.log(mappedData)
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
    }
  };

  // Función para manejar la pérdida de foco
  const handleAfterBlur = (event) => {
    const { row, col, value } = event;
    if (col > 1) { // Ignorar columnas A (0) y B (1)
      if (value === '' && col in selects) {
        // Eliminar el select si la celda está vacía
        setSelects(prev => {
          const newSelects = { ...prev };
          delete newSelects[col];
          return newSelects;
        });
      }
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
    console.log(jsonData)
    // Ahora, mapear jsonData al esquema de NotaSchema
    const mappedData = {
      curso: course, // Aquí podrías extraer el curso de jsonData si está presente
      grupo: group,  // Lo mismo con el grupo
      estudiantes: jsonData.map(item => {
          const notas = Object.keys(item)
              .filter(key => key !== 'codigo' && key !== 'nombres') // Filtrar las propiedades que no son notas
              .map(key => ({
                  nombre_nota: key, // Usar el nombre de la propiedad como nombre de la evaluación
                  codigos_indicadores: [], // Aquí puedes agregar lógica si necesitas códigos específicos
                  calificacion: parseFloat(item[key]) || 0, // Nota del estudiante
                  porcentaje: 0 // Puedes asignar un porcentaje específico si es necesario
              }));
          
          return {
              nombre: item.nombres, // Asumiendo que hay una columna 'nombres'
              notas: notas
          };
      })
  };

    console.log(mappedData)
};


const handleResultChange = (value, index) => {
  setMappedData(prev => ({ ...prev, codigos_indicadores: value }));
  console.log(value, index)
};

  // Generar un array de porcentajes de 0 a 100 en incrementos de 5
  const percentageOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  // Manejar el cambio en el select de porcentaje
  const handlePercentageChange = (index, value) => {
    setPercentageSelects(prev => ({ ...prev, [index]: value }));
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
                        <SelectTagResultsAp course={course} style={{ zIndex: 1000 }} onChange={handleResultChange} />
                      </div>
                      
                      <select
                        value={percentageSelects[index] || ''}
                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                        className="border border-gray-300 w-[60px] h-[35px] text-xs rounded-md"
                      >
                        <option value="" disabled></option>
                        {percentageOptions.map(percentage => (
                          <option key={percentage} value={percentage}>{percentage}%</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      <HotTable
        data={data}
        formulas={{
          engine: HyperFormula,
        }}
        colHeaders={true}
        rowHeaders={true}
        stretchH="all"
        fixedRowsTop={1}
        height={500}
        contextMenu={true}
        multiColumnSorting={true}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleDataChange} // Escuchar cambios en la tabla
        afterBlur={handleAfterBlur} // Escuchar pérdida de foco
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

const styles = {
  backgroundColor: "#c62120",
  color: "white",
  transition: "width 0.1s ease-in-out",
  fontWeight: "bold",
};
