import { HyperFormula } from "hyperformula";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { useState } from 'react';
import "handsontable/dist/handsontable.full.min.css";
import { Button } from "rsuite";

// Register Handsontable's modules
registerAllModules();

export default function HandsontableSheet() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    ["Sum", "Average", "Average", "Sum", "Sum"],
    ["150", "643", "0.32", "11", "=A1*(B1*C1)+D1"],
    ["172", "474", "0.51", "11", "=A2*(B2*C2)+D2"],
    ["188", "371", "0.59", "11", "=A3*(B3*C3)+D3"],
    ["162", "731", "0.21", "10", "=A4*(B4*C4)+D4"],
    ["133", "682", "0.81", "9", "=A5*(B5*C5)+D5"],
    ["87", "553", "0.66", "10", "=A6*(B6*C6)+D6"],
    ["26", "592", "0.62", "11", "=A7*(B7*C7)+D7"],
    ["110", "461", "0.73", "9", "=A8*(B8*C8)+D8"],
  ]);

  // Función para manejar la carga del archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const newData = text.split('\n').map(row => row.split(','));

        const extendedData = newData.map(row => [
          ...row,
          "", "", "", "", "", // Añadir celdas vacías adicionales si es necesario
        ]);

        const emptyRows = Array(5).fill(new Array(extendedData[0].length).fill("")); // Crear 5 filas vacías

        const combinedData = [
          ...extendedData, 
          ...emptyRows
        ];

        setData(combinedData); 
        setLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const saveData = () => {
    console.log(data); 
  }

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
        contextMenu= {true}
        multiColumnSorting ={true}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
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
