import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService'; // 1. IMPORTAR el nuevo servicio
import ProductCard from '../../components/common/ProductCard/ProductCard';
import './ProductCatalog.scss';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 2. ESTADO para las categorías de la API
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 3. OBTENER productos y categorías en paralelo para mayor eficiencia
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError('No se pudieron cargar los productos o categorías. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.categoryid === categoryId);
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="product-catalog">
      <div className="product-catalog__container">
        <h1 className="product-catalog__title">Nuestro Catálogo</h1>
        <div className="product-catalog__filters">
          {/* Botón "Todos" que siempre estará presente */}
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Todos
          </button>

          {/* 4. RENDERIZAR los botones de categoría desde el estado */}
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && (
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const category = categories.find(cat => cat.id === product.categoryid);
                const categoryName = category ? category.name : 'Sin Categoría';

                return (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    categoryName={categoryName}
                  />
                )
              })
            ) : (
              <p>No se encontraron productos en esta categoría.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;