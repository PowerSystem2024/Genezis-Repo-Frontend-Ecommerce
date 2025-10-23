import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart, FiX, FiMenu } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import { useProducts } from '../../../context/ProductContext';
import MobileMenu from '../MobileMenu/MobileMenu'; // 1. Importar el nuevo componente
import './Navbar.scss';

const Navbar = () => {
  const { items } = useCart();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 2. Nuevo estado
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => { e.preventDefault(); if (searchTerm.trim()) { navigate(`/products?search=${searchTerm}`); setIsSearchFocused(false); } };
  const clearSearch = () => { setSearchTerm(''); };
  
  const suggestions = useMemo(() => {
    if (!searchTerm || !isSearchFocused) return [];
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);
  }, [searchTerm, products, isSearchFocused]);

  return (
    <> {/* 3. Envolver en un Fragment para incluir MobileMenu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <header className="navbar">
        <div className="navbar__container">
          {/* 4. Icono de Hamburguesa y Logo */}
          <div className="navbar__left">
            <button className="navbar__hamburger" onClick={() => setIsMobileMenuOpen(true)}>
              <FiMenu />
            </button>
            <Link to="/" className="navbar__logo">GAMERSTORE</Link>
          </div>
          
          {/* Navegación para Escritorio */}
          <nav className="navbar__nav-desktop">
            <Link to="/products" className="navbar__link">Productos</Link>
            <Link to="/build-pc" className="navbar__link">Armá tu PC</Link>
            <Link to="/help" className="navbar__link">Ayuda</Link>
          </nav>
          
          <div className="navbar__actions">
            <div className="navbar__search-wrapper">
              <form className="navbar__search" onSubmit={handleSearchSubmit}>
                <FiSearch className="navbar__icon" />
                <input 
                  type="text" 
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                {searchTerm && (
                  <button type="button" className="navbar__search-clear" onClick={clearSearch}><FiX /></button>
                )}
              </form>
              {suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.map(p => <li key={p.id}><Link to={`/products/${p.id}`}>{p.name}</Link></li>)}
                </ul>
              )}
            </div>
            
            {/* Ocultamos el icono de usuario en pantallas muy pequeñas para dar espacio */}
            <Link to="/login" className="navbar__action-link navbar__user-icon">
              <FiUser className="navbar__icon" />
            </Link>
            
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