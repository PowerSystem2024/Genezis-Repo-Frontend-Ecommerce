import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { formatCurrency } from '../../../utils/formatCurrency'; // <-- IMPORTAR
import './ProductCardHome.scss';

const ProductCardHome = ({ product, categoryName }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card-home">
      <Link to={`/products/${product.id}`} className="card-image-link">
        <img src={product.coverimageurl} alt={product.name} className="card-image"/>
      </Link>
      <div className="card-content">
        <p className="card-category">{categoryName}</p>
        <h3 className="card-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="card-footer">
          {/* --- MODIFICACIÓN AQUÍ --- */}
          <p className="card-price">{formatCurrency(product.price)}</p>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardHome;