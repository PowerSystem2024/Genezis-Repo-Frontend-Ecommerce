import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';
import './ProductDetail.scss';
import ProductGallery from '../../components/common/ProductGallery/ProductGallery';

// --- 1. IMPORTAR EL NUEVO COMPONENTE DE SPECS ---
import ProductSpecs from '../../components/common/ProductSpecs/ProductSpecs';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. AÑADIR ESTADO PARA LAS PESTAÑAS ---
  const [activeTab, setActiveTab] = useState('preguntas'); // Default tab
  const [hasSpecs, setHasSpecs] = useState(false); // Estado para saber si mostrar la pestaña

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productData, categoriesData] = await Promise.all([
          getProductById(productId),
          getAllCategories()
        ]);

        setProduct(productData); // productData ahora incluye product.gallery

        const foundCategory = categoriesData.find(cat => cat.id === productData.categoryid);
        setCategory(foundCategory);

        // --- 3. LÓGICA DE PESTAÑAS ---
        if (productData.specs && Object.keys(productData.specs).length > 0) {
          setHasSpecs(true);
          setActiveTab('especificaciones'); 
        } else {
          setHasSpecs(false);
          setActiveTab('preguntas'); 
        }
        // --- FIN LÓGICA DE PESTAÑAS ---

      } catch (err) {
        console.error(err);
        setError(err.message || 'Ocurrió un error al cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // --- 4. FUNCIÓN PARA RENDERIZAR EL CONTENIDO DE LA PESTAÑA ---
  const renderTabContent = () => {
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
        
        {/* --- ESTE ES TU CÓDIGO FUNCIONAL (SIN CAMBIOS) --- */}
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
        {/* --- FIN DE TU CÓDIGO FUNCIONAL --- */}


        {/* --- 5. SECCIÓN INFERIOR (PESTAÑAS) AÑADIDA DEBAJO --- */}
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
        {/* --- FIN DE LA SECCIÓN AÑADIDA --- */}

      </div>
    </div>
  );
};

export default ProductDetail;