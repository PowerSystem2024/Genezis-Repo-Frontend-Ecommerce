import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
// --- 1. IMPORTAMOS LOS NUEVOS ICONOS ---
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency'; // <-- IMPORTAR
import './Cart.scss';

// Componente interno para el resumen (Sin cambios)
const CartSummary = ({ total }) => (
  <aside className="cart-summary">
    <h2>Resumen de compra</h2>
    <div className="summary-row">
      <span>Productos ({total.itemCount})</span>
      <span>{formatCurrency(total.price)}</span>
    </div>
    <div className="summary-row">
      <span>Envío</span>
      <span className="free-shipping">Gratis</span>
    </div>
    <div className="summary-row total-row">
      <span>Total</span>
      <span>{formatCurrency(total.price)}</span>
    </div>
    <Link to="/checkout" className="cart__cta-btn">
      Continuar compra
    </Link>
  </aside>
);

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart();

  const totals = useMemo(() => {
    // (Sin cambios aquí)
    const rawPrice = items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { price: rawPrice, itemCount };
  }, [items]);

  // --- 2. HANDLERS PARA LOS BOTONES + Y - ---
  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    // Solo resta si la cantidad es mayor a 1
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  if (items.length === 0) {
    // (Sin cambios en la vista de carrito vacío)
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
              
              {/* --- 3. INFO AHORA SOLO TIENE EL NOMBRE --- */}
              <div className="item-info">
                <Link to={`/products/${item.id}`} className="item-name">{item.name}</Link>
                {/* El botón de eliminar se movió */}
              </div>

              {/* --- 4. NUEVO CONTROLADOR DE CANTIDAD --- */}
              <div className="item-quantity-control">
                <button 
                  className="quantity-btn" 
                  onClick={() => handleDecrease(item)}
                  aria-label="Restar uno"
                  disabled={item.quantity <= 1} // Deshabilitar si es 1
                >
                  <FiMinus />
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => handleIncrease(item)}
                  aria-label="Sumar uno"
                >
                  <FiPlus />
                </button>
              </div>

              {/* --- 5. PRECIO (AHORA 4TA COLUMNA EN DESKTOP) --- */}
              <p className="item-price">{formatCurrency(parseFloat(item.price) * item.quantity)}</p>

              {/* --- 6. BOTÓN DE ELIMINAR (AHORA 5TA COLUMNA EN DESKTOP) --- */}
              <button 
                onClick={() => removeFromCart(item.id)} 
                className="item-remove-btn"
                aria-label="Eliminar producto"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </main>
        <CartSummary total={totals} />
      </div>
    </div>
  );
};

export default Cart;