import React, { useRef } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoGenezis from '../../../assets/images/logogenezis.png';
import { formatCurrency } from '../../../utils/formatCurrency'; // <-- IMPORTAR
import './OrderDetailModal.scss';

const OrderDetailModal = ({ order, isLoading, onClose }) => {
  const invoiceRef = useRef(null);

  const handleDownloadPdf = () => {
    // ... (código existente para PDF sin cambios) ...
     const input = invoiceRef.current;
    if (!input) return;

    const downloadBtn = input.querySelector('.download-btn-wrapper');
    if (downloadBtn) downloadBtn.style.visibility = 'hidden';

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`factura_orden_${order.id}.pdf`);

      if (downloadBtn) downloadBtn.style.visibility = 'visible';
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading || !order.items) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header"><h2>Detalle de la Orden</h2><button onClick={onClose} className="close-btn"><FiX /></button></div>
                <div className="modal-body"><p>Cargando detalles de la orden...</p></div>
            </div>
        </div>
    );
  }

  // Calculamos los subtotales aquí para asegurar que sean números antes de formatear
  const itemsWithSubtotal = order.items.map(item => ({
      ...item,
      subtotal: item.quantity * parseFloat(item.priceatpurchase || 0)
  }));


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalle de la Orden #{order.id}</h2>
          <div className="download-btn-wrapper">
            <button className="download-btn" onClick={handleDownloadPdf}>
                <FiDownload /> Descargar PDF
            </button>
          </div>
          <button onClick={onClose} className="close-btn"><FiX /></button>
        </div>

        <div className="modal-body">
            <div className="invoice-container a4-style" ref={invoiceRef}>
                <header className="invoice-header-a4">
                    <div className="seller-details">
                        <img src={logoGenezis} alt="Logo Genezis" className="invoice-logo" />
                        <p><strong>Genezis S.A.</strong></p>
                        <p>Av. Siempre Viva 742</p>
                        <p>Springfield, CP 1234</p>
                        <p>CUIT: 30-12345678-9</p>
                    </div>
                    <div className="invoice-title-box">
                        <div className="invoice-type">A</div>
                        <div>
                            <h1>FACTURA</h1>
                            <p><strong>N°:</strong> {String(order.id).padStart(8, '0')}</p>
                            <p><strong>Fecha:</strong> {formatDate(order.createdat)}</p>
                        </div>
                    </div>
                </header>

                <section className="customer-details-a4">
                    <p><strong>Cliente:</strong> {order.firstname} {order.lastname}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    {/* Podrías añadir más detalles del cliente si están disponibles en 'order' */}
                </section>

                <table className="items-table a4-style">
                    <thead>
                    <tr>
                        <th>Producto / Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Usamos itemsWithSubtotal que ya tiene el subtotal calculado */}
                    {itemsWithSubtotal.map((item, index) => (
                        <tr key={item.productid || index}>
                        <td>{item.productName || `Producto ID: ${item.productid}`}</td> {/* Muestra nombre o ID */}
                        <td>{item.quantity}</td>
                        {/* --- MODIFICACIÓN AQUÍ --- */}
                        <td>{formatCurrency(item.priceatpurchase)}</td>
                        {/* --- MODIFICACIÓN AQUÍ --- */}
                        <td>{formatCurrency(item.subtotal)}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">TOTAL:</td>
                        {/* --- MODIFICACIÓN AQUÍ --- */}
                        <td className="total-amount">{formatCurrency(order.totalamount)}</td>
                      </tr>
                    </tfoot>
                </table>

                <footer className="invoice-footer-a4">
                    <p>CAE N°: 12345678901234 | Vto. CAE: {formatDate(new Date())}</p> {/* Ejemplo */}
                    <p>Documento no válido como factura</p>
                </footer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;