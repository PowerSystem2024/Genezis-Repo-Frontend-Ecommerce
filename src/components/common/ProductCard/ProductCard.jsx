import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductCard.scss';

const ProductCard = ({ product, categoryName }) => {
  if (!product) {
    return null;
  }
  
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__image-link">
        {/* CORRECCIÓN AQUÍ: Usamos 'coverimageurl' en minúsculas */}
        <img src={product.coverimageurl} alt={product.name} className="product-card__image" />
      </Link>
      <div className="product-card__info">
        <span className="product-card__category">{categoryName}</span>
        
        <h3 className="product-card__name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-card__footer">
          <p className="product-card__price">${parseFloat(product.price).toFixed(2)}</p>
          <button className="product-card__cart-btn">
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;