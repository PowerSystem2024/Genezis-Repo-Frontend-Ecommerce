import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { FiX, FiTrash2 } from 'react-icons/fi';
import './CartSidebar.scss';

const CartSidebar = () => {
  const { items, isSidebarOpen, closeSidebar, removeFromCart } = useCart();

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  }, [items]);

  return (
    <>
      <div className={`cart-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="cart-sidebar__header">
          <h3>Agregaste a tu carrito</h3>
          <button onClick={closeSidebar} className="cart-sidebar__close-btn">
            <FiX />
          </button>
        </div>
        
        {items.length > 0 ? (
          <div className="cart-sidebar__content">
            {items.map(item => (
              <div key={item.id} className="cart-sidebar__item">
                <img src={item.coverimageurl} alt={item.name} />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="item-remove-btn">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="cart-sidebar__empty-message">Tu carrito está vacío.</p>
        )}
        
        <div className="cart-sidebar__footer">
          <div className="subtotal">
            <span>Subtotal:</span>
            <span>${totalPrice}</span>
          </div>
          <Link to="/cart" onClick={closeSidebar} className="view-cart-btn">
            Ir al carrito
          </Link>
        </div>
      </div>
      {/* Overlay para oscurecer el fondo cuando el sidebar está abierto */}
      <div 
        className={`cart-sidebar__overlay ${isSidebarOpen ? 'is-visible' : ''}`}
        onClick={closeSidebar}
      />
    </>
  );
};

export default CartSidebar;