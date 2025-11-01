import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// 1. IMPORTAMOS EL NUEVO ICONO FiGrid
import { FiUser, FiShoppingCart, FiMenu, FiLogOut, FiGrid } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.scss';

const Navbar = () => {
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <Link to="/" className="navbar__logo">GAMERSTORE</Link>
          </div>
          
          <nav className="navbar__nav-desktop">
            {/* 2. ENLACES DE TEXTO ELIMINADOS DE AQUÍ */}
            
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/products" className="navbar__link">Admin</Link>
            )}
          </nav>
          
          <div className="navbar__actions">

            {/* 3. NUEVO ICONO DE CATÁLOGO AÑADIDO AQUÍ */}
            <Link to="/products" className="navbar__action-link" title="Ver Productos">
              <FiGrid className="navbar__icon" />
            </Link>
            
            {isAuthenticated ? (
              <div className="navbar__user-menu">
                <span className="navbar__username">Hola, {user?.firstName}</span>
                <button onClick={logout} className="navbar__logout-btn">
                  <FiLogOut title="Cerrar Sesión" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="navbar__action-link navbar__user-icon">
                <FiUser className="navbar__icon" />
              </Link>
            )}
            
            <Link to="/cart" className="navbar__action-link navbar__cart-link">
              <FiShoppingCart className="navbar__icon" />
              {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;