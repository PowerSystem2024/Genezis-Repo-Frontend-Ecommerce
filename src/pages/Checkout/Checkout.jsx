import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { createPaymentPreference } from '../../services/checkoutService';
import './Checkout.scss';

const Checkout = () => {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  }, [items]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const preference = await createPaymentPreference(items);
      if (preference.init_point) {
        window.location.href = preference.init_point;
      } else {
        setError('No se pudo obtener la URL de pago. Por favor, intente de nuevo.');
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-container empty">
        <h2>Tu carrito está vacío</h2>
        <p>No tienes productos para comprar.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-summary">
        <h2>Resumen de la Orden</h2>
        {items.map(item => (
          <div key={item.id} className="summary-item">
            <span className="item-name">{item.name} (x{item.quantity})</span>
            <span className="item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total:</strong>
          <strong>${totalPrice}</strong>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handlePayment} disabled={loading} className="pay-button">
          {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;