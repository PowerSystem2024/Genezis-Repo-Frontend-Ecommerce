import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiLoader } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import './ProductCard.scss';

// El componente ahora recibe 'viewMode'
const ProductCard = ({ product, categoryName, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };
  
  // Usamos una clase condicional para cambiar el layout
  return (
    <div className={`product-card product-card--${viewMode}`}>
      <Link to={`/products/${product.id}`} className="product-card__image-link">
        <img src={product.coverimageurl} alt={product.name} className="product-card__image" />
      </Link>
      
      <div className="product-card__info">
        <span className="product-card__category">{categoryName}</span>
        <h3 className="product-card__name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        {/* Mostramos la descripción solo en modo lista */}
        {viewMode === 'list' && <p className="product-card__description">{product.description}</p>}
      </div>

      <div className="product-card__actions">
        <p className="product-card__price">${parseFloat(product.price).toFixed(2)}</p>
        <button 
          className="product-card__cart-btn" 
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? <FiLoader className="loader-icon" /> : <FiShoppingCart />}
          {/* Añadimos texto al botón en modo lista */}
          {viewMode === 'list' && <span>Sumar al carrito</span>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;