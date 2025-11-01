import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
// --- 1. IMPORTAR NUEVOS ICONOS ---
import { FiShoppingCart, FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';
import './ProductDetail.scss';
import ProductGallery from '../../components/common/ProductGallery/ProductGallery';
import ProductSpecs from '../../components/common/ProductSpecs/ProductSpecs';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preguntas');
  const [hasSpecs, setHasSpecs] = useState(false);

  useEffect(() => {
    // ... (Lógica de fetch de datos sin cambios) ...
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productData, categoriesData] = await Promise.all([
          getProductById(productId),
          getAllCategories()
        ]);

        setProduct(productData);
        const foundCategory = categoriesData.find(cat => cat.id === productData.categoryid);
        setCategory(foundCategory);

        if (productData.specs && Object.keys(productData.specs).length > 0) {
          setHasSpecs(true);
          setActiveTab('especificaciones'); 
        } else {
          setHasSpecs(false);
          setActiveTab('preguntas'); 
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Ocurrió un error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // --- 2. HANDLER PARA EL BOTÓN "VOLVER ARRIBA" ---
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Scroll suave
    });
  };

  const renderTabContent = () => {
    // ... (Sin cambios aquí) ...
    switch (activeTab) {
      case 'especificaciones':
        return <ProductSpecs specs={product.specs} />;
      default:
        return null;
    }
  };

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
        
        {/* --- 3. ENLACE "VOLVER AL CATÁLOGO" AÑADIDO --- */}
        <Link to="/products" className="product-detail__back-link">
          <FiArrowLeft />
          Volver al catálogo
        </Link>

        {/* --- Grid principal (sin cambios) --- */}
        <div className="product-detail__grid">
          <ProductGallery 
            coverImage={product.coverimageurl}
            galleryImages={product.gallery}
          />
          <div className="product-detail__info">
            {category && (
              <Link to="/products" className="product-detail__breadcrumb">
                {category.name}
              </Link>
            )}
            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__price">{formatCurrency(product.price)}</p>
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
              onClick={() => addToCart(product)}
            >
              <FiShoppingCart />
              Añadir al carrito
            </button>
          </div>
        </div>
        
        {/* --- Sección de Pestañas (sin cambios) --- */}
        <div className="product-detail__tabs">
          <nav className="tabs-nav">
            {hasSpecs && (
              <button
                className={`tabs-nav__btn ${activeTab === 'especificaciones' ? 'active' : ''}`}
                onClick={() => setActiveTab('especificaciones')}
              >
                Especificaciones
              </button>
            )}
          </nav>
          <div className="tabs-content">
            {renderTabContent()}
          </div>
        </div>

        {/* --- 4. BOTÓN "VOLVER ARRIBA" AÑADIDO --- */}
        <button onClick={handleBackToTop} className="product-detail__back-to-top">
          <FiArrowUp />
          Volver arriba
        </button>

      </div>
    </div>
  );
};

export default ProductDetail;