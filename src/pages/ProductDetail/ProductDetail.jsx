import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { FiShoppingCart } from 'react-icons/fi';
import './ProductDetail.scss';

const ProductDetail = () => {
  const { productId } = useParams(); // Hook para obtener los parámetros de la URL
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtenemos el producto y todas las categorías simultáneamente
        const [productData, categoriesData] = await Promise.all([
          getProductById(productId),
          getAllCategories()
        ]);
        
        setProduct(productData);

        // Buscamos el nombre de la categoría correspondiente
        const foundCategory = categoriesData.find(cat => cat.id === productData.categoryid);
        setCategory(foundCategory);

      } catch (err) {
        console.error(err);
        setError(err.message || 'Ocurrió un error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]); // Se ejecuta cada vez que el productId de la URL cambia

  if (loading) {
    return <p className="status-message">Cargando producto...</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  if (!product) {
    return <p className="status-message">Producto no disponible.</p>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail__container">
        <div className="product-detail__grid">
          <div className="product-detail__image-container">
            <img src={product.coverimageurl} alt={product.name} />
          </div>
          <div className="product-detail__info">
            {category && (
              <Link to="/products" className="product-detail__breadcrumb">
                {category.name}
              </Link>
            )}
            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__price">${parseFloat(product.price).toFixed(2)}</p>
            <p className="product-detail__description">{product.description}</p>
            
            <div className="product-detail__stock">
              Disponibilidad: 
              <span className={product.stock > 0 ? 'stock-status available' : 'stock-status unavailable'}>
                {product.stock > 0 ? `En Stock (${product.stock} unidades)` : 'Agotado'}
              </span>
            </div>

            <button 
              className="product-detail__add-to-cart-btn" 
              disabled={product.stock === 0}
            >
              <FiShoppingCart />
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;