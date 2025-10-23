import React from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import './PaymentStatus.scss';

const PaymentFailure = () => {
  return (
    <div className="payment-status-container">
      <FiXCircle className="status-icon failure" />
      <h1>Pago Fallido</h1>
      <p>Hubo un problema al procesar tu pago. Por favor, intenta de nuevo o contacta a soporte.</p>
      <Link to="/cart" className="status-link">Volver al Carrito</Link>
    </div>
  );
};

export default PaymentFailure;