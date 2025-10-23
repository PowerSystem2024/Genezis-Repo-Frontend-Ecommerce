import React from 'react';
// --- CORRECCIÓN EN ESTA LÍNEA ---
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import './MobileMenu.scss';

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
        <div className="mobile-menu__header">
          <Link to="/" onClick={onClose} className="mobile-menu__logo">GAMERSTORE</Link>
          <button onClick={onClose} className="mobile-menu__close-btn"><FiX /></button>
        </div>
        <nav className="mobile-menu__nav">
          <Link to="/products" onClick={onClose} className="mobile-menu__link">Productos</Link>
          <Link to="/build-pc" onClick={onClose} className="mobile-menu__link">Armá tu PC</Link>
          <Link to="/help" onClick={onClose} className="mobile-menu__link">Ayuda</Link>
        </nav>
      </div>
      <div 
        className={`mobile-menu__overlay ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
      />
    </>
  );
};

export default MobileMenu;