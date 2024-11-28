import React, { useState } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument'; 
import { storage } from '../../api/firebase/config'; // Ajusta la ruta según tu estructura
import { ref, uploadBytes } from "firebase/storage";

const DownloadPDF = ({ generalInfo, reportData, followUp, resultadosAprendizaje, cantEstudiantes, cursoInfo }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar el PDF como Blob, descargarlo y subirlo al Storage
  const handleGenerateAndUploadPDF = async () => {
    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      // Generar el PDF como un Blob
      const pdfBlob = await pdf(
        <PDFDocument
          generalInfo={generalInfo}
          reportData={reportData}
          followUp={followUp}
          resultadosAprendizaje={resultadosAprendizaje}
          cantEstudiantes={cantEstudiantes}
          cursoInfo={cursoInfo}
        />
      ).toBlob();

      // Descargar el PDF localmente
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'informe_grupal.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Crear una referencia en Firebase Storage
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Formato YYYY-MM-DDTHH-MM-SS
      const storageRef = ref(storage, `informes/${generalInfo.curso}/${generalInfo.año}/${generalInfo.periodo}/${generalInfo.grupo}/${timestamp}.pdf`);

      // Subir el archivo PDF al Storage
      await uploadBytes(storageRef, pdfBlob);

      setUploading(false);
      setUploadSuccess(true);
    } catch (err) {
      console.error("Error generando o subiendo el PDF:", err);
      setError("Error al generar o subir el PDF. Intenta nuevamente.");
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Botón para generar, descargar y subir el PDF al Storage */}
      <button
        onClick={handleGenerateAndUploadPDF}
        disabled={uploading}
      >
        {uploading ? 'Generando y subiendo PDF...' : 'Subir y generar PDF'}
      </button>

      {/* Mensaje de éxito o error */}
      {uploadSuccess && <p style={{ color: 'green' }}>¡PDF generado y subido con éxito!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DownloadPDF;
