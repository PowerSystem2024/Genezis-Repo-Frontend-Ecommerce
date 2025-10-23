import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import './Cart.scss';

// Componente interno para el resumen
const CartSummary = ({ total }) => (
  <aside className="cart-summary">
    <h2>Resumen de compra</h2>
    <div className="summary-row">
      <span>Productos ({total.itemCount})</span>
      <span>${total.price}</span>
    </div>
    <div className="summary-row">
      <span>Envío</span>
      <span className="free-shipping">Gratis</span>
    </div>
    <div className="summary-row total-row">
      <span>Total</span>
      <span>${total.price}</span>
    </div>
    <Link to="/checkout" className="cart__cta-btn">
      Continuar compra
    </Link>
  </aside>
);

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart();

  const totals = useMemo(() => {
    const price = items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { price, itemCount };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h2>Tu carrito está vacío</h2>
        <p>Parece que todavía no has añadido ningún producto.</p>
        <Link to="/products" className="cart__cta-btn">
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__grid">
        <main className="cart-items">
          <h2>Productos</h2>
          {items.map(item => (
            <div key={item.id} className="cart-page-item">
              <img src={item.coverimageurl} alt={item.name} className="item-image" />
              <div className="item-info">
                <Link to={`/products/${item.id}`} className="item-name">{item.name}</Link>
                <button onClick={() => removeFromCart(item.id)} className="item-remove">Eliminar</button>
              </div>
              <div className="item-quantity">
                <input 
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                />
              </div>
              <p className="item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </main>
        <CartSummary total={totals} />
      </div>
    </div>
  );
};

export default Cart;