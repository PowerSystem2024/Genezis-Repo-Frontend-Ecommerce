import React, { useRef } from 'react'; // <-- COMA ELIMINADA
import { FiX, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoGenezis from '../../../assets/images/logogenezis.png';
import './OrderDetailModal.scss';

const OrderDetailModal = ({ order, isLoading, onClose }) => {
  const invoiceRef = useRef(null);

  const handleDownloadPdf = () => {
    const input = invoiceRef.current;
    if (!input) return;

    const downloadBtn = input.querySelector('.download-btn-wrapper');
    // Usamos 'visibility' para no afectar el layout al ocultar el botón
    if (downloadBtn) downloadBtn.style.visibility = 'hidden';

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // p = portrait, mm = millimeters, a4
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalle de la Orden #{order.id}</h2>
          {/* Mantenemos el botón de descarga aquí para que no se oculte con el scroll */}
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
                    {order.items.map((item, index) => (
                        <tr key={item.productid || index}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>${parseFloat(item.priceatpurchase).toFixed(2)}</td>
                        <td>${(item.quantity * parseFloat(item.priceatpurchase)).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">TOTAL:</td>
                        <td className="total-amount">${parseFloat(order.totalamount).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                </table>
                
                <footer className="invoice-footer-a4">
                    <p>CAE N°: 12345678901234 | Vto. CAE: {formatDate(new Date())}</p>
                    <p>Documento no válido como factura</p>
                </footer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;