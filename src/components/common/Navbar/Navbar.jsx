import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
import './Navbar.scss';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          GAMERSTORE
        </Link>
        <nav className="navbar__nav">
          <Link to="/products" className="navbar__link">Productos</Link>
          <Link to="/build-pc" className="navbar__link">Armá tu PC</Link>
          <Link to="/help" className="navbar__link">Ayuda</Link>
        </nav>
        <div className="navbar__actions">
          <div className="navbar__search">
            <FiSearch className="navbar__icon" />
            <input type="text" placeholder="Buscar productos..." />
          </div>
          <Link to="/login" className="navbar__action-link">
            <FiUser className="navbar__icon" />
          </Link>
          <Link to="/cart" className="navbar__action-link">
            <FiShoppingCart className="navbar__icon" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;