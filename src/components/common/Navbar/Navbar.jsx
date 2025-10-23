import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiMenu, FiLogOut } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import MobileMenu from '../MobileMenu/MobileMenu';
import './Navbar.scss';

const Navbar = () => {
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <header className="navbar">
        <div className="navbar__container">
          <div className="navbar__left">
            <button className="navbar__hamburger" onClick={() => setIsMobileMenuOpen(true)}><FiMenu /></button>
            <Link to="/" className="navbar__logo">GAMERSTORE</Link>
          </div>
          
          <nav className="navbar__nav-desktop">
            <Link to="/products" className="navbar__link">Productos</Link>
            <Link to="/build-pc" className="navbar__link">Armá tu PC</Link>
            <Link to="/help" className="navbar__link">Ayuda</Link>

            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/products" className="navbar__link">Admin</Link>
            )}
          </nav>
          
          <div className="navbar__actions">
            {isAuthenticated ? (
              <div className="navbar__user-menu">
                {/* --- CORRECCIÓN APLICADA AQUÍ --- */}
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