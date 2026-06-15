import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

class PDFService {
    generarReporteProductos(productos, titulo = "Reporte de Productos") {
        if (!productos || productos.length === 0) {
            alert('No hay productos para generar el reporte');
            return;
        }

        const doc = new jsPDF();
        const fecha = new Date().toLocaleDateString('es-ES');
        const hora = new Date().toLocaleTimeString('es-ES');

        // Título
        doc.setFontSize(20);
        doc.setTextColor(112, 161, 191);
        doc.text("Renueva tu Estilo - Tienda de Ropa", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(titulo, 105, 40, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado: ${fecha} - ${hora}`, 105, 50, { align: "center" });

        // Tabla de productos
        const tableData = productos.map((p, i) => [
            i + 1, 
            p.nombre, 
            `Bs ${p.precio}`, 
            p.stock || 'N/D'
        ]);

        autoTable(doc, {
            startY: 60,
            head: [["#", "Producto", "Precio", "Stock"]],
            body: tableData,
            theme: 'striped',
            headStyles: { 
                fillColor: [112, 161, 191], 
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            }
        });

        // Resumen
        const finalY = doc.lastAutoTable.finalY || 80;
        doc.text(`Total de productos: ${productos.length}`, 105, finalY + 10, { align: "center" });

        const total = productos.reduce((sum, p) => sum + (p.precio || 0), 0);
        doc.text(`Valor total: Bs ${total}`, 105, finalY + 20, { align: "center" });

        // Guardar
        doc.save(`reporte_${new Date().toISOString().split('T')[0]}.pdf`);
    }
}

export default new PDFService();