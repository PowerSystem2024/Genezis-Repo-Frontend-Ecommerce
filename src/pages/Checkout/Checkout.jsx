import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { createPaymentPreference } from '../../services/checkoutService';
import { formatCurrency } from '../../utils/formatCurrency'; // <-- IMPORTAR
import './Checkout.scss';

const Checkout = () => {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculamos el precio total sin formatear para la lógica interna
  const rawTotalPrice = useMemo(() => {
    return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  }, [items]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const preference = await createPaymentPreference(items);
      if (preference && preference.init_point) {
        window.location.href = preference.init_point;
      } else {
        setError('No se pudo obtener la URL de pago. Por favor, intente de nuevo.');
      }
    } catch (err) {
      console.error("Error al procesar el pago:", err.message);
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
        <h2>Resumen de la orden</h2>
        {items.map(item => (
          <div key={item.id} className="summary-item">
            <span className="item-name">{item.name} (x{item.quantity})</span>
            {/* --- MODIFICACIÓN AQUÍ --- */}
            <span className="item-price">{formatCurrency(parseFloat(item.price) * item.quantity)}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total:</strong>
          {/* --- MODIFICACIÓN AQUÍ --- */}
          <strong>{formatCurrency(rawTotalPrice)}</strong>
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