import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument'; 
const DownloadPDF = ({ generalInfo, reportData, followUp, resultadosAprendizaje }) => (
  <div>
    <PDFDownloadLink
      document={
        <PDFDocument
          generalInfo={generalInfo}
          reportData={reportData}
          followUp={followUp}
          resultadosAprendizaje={resultadosAprendizaje}
        />
      }
      fileName="informe_grupal.pdf"
    >
      {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
    </PDFDownloadLink>
  </div>
);

export default DownloadPDF;
