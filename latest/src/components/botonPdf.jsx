import React from 'react';
import pdfService from '../services/pdfService';
import './botonPdf.css';

const BotonPdf = ({ productos }) => {
    const handleGenerarPDF = () => {
        if (productos && productos.length > 0) {
            pdfService.generarReporteProductos(productos);
        } else {
            alert('No hay productos para generar el reporte');
        }
    };

    return (
        <button className="btn-pdf-component" onClick={handleGenerarPDF}>
        Generar Reporte PDF
        </button>
    );
};

export default BotonPdf;