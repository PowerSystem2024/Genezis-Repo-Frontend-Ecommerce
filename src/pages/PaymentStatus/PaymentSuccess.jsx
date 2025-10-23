import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import './PaymentStatus.scss';

const PaymentSuccess = () => {
  return (
    <div className="payment-status-container">
      <FiCheckCircle className="status-icon success" />
      <h1>¡Pago Aprobado!</h1>
      <p>Tu orden ha sido procesada exitosamente. Recibirás un correo con los detalles.</p>
      <Link to="/products" className="status-link">Seguir Comprando</Link>
    </div>
  );
};

export default PaymentSuccess;