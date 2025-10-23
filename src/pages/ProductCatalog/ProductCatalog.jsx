import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getAllCategories } from '../../services/categoryService';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import CategorySidebar from '../../components/common/CategorySidebar/CategorySidebar';
import FilterSidebar from '../../components/common/FilterSidebar/FilterSidebar';
import { FiGrid, FiList, FiMenu, FiFilter } from 'react-icons/fi';
import './ProductCatalog.scss';

const ProductCatalog = () => {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true); // Se usará ahora
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromURL = params.get('search');
    setSearchTerm(searchFromURL || '');
  }, [location.search]);

  const filteredAndSortedProducts = useMemo(() => {
    // ... (esta lógica no cambia)
    let result = [...products];
    if (activeCategory !== 'all') {
      result = result.filter(p => p.categoryid === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (sortOrder) {
      case 'price-asc': result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case 'price-desc': result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      default: break;
    }
    return result;
  }, [products, activeCategory, searchTerm, sortOrder]);

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setIsFilterSidebarOpen(false);
  };
  
  const renderProductList = () => {
    // CORRECCIÓN: Usamos todos los estados de carga y error
    if (productsLoading || loadingCategories) return <p>Cargando...</p>;
    if (productsError) return <p className="error-message">{productsError}</p>;

    return (
      <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map(product => {
            const category = categories.find(cat => cat.id === product.categoryid);
            const categoryName = category ? category.name : 'Sin Categoría';
            return <ProductCard key={product.id} product={product} categoryName={categoryName} viewMode={viewMode} />;
          })
        ) : (
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
      </div>
    );
  };

  return (
    <div className="product-catalog-page">
      {/* ... (el resto del JSX no cambia) ... */}
      <FilterSidebar isOpen={isFilterSidebarOpen} onClose={() => setIsFilterSidebarOpen(false)}>
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />
      </FilterSidebar>
      <div className="catalog-container">
        <aside className="desktop-filters">
          <CategorySidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        </aside>
        <main className="product-list-container">
          <div className="mobile-filter-buttons">
            <button onClick={() => setIsFilterSidebarOpen(true)}><FiMenu /> Categorías</button>
            <button><FiFilter /> Filtros</button>
          </div>
          <div className="product-list-header">
            <h1>{categories.find(c => c.id === activeCategory)?.name || 'Todos los productos'}</h1>
            <div className="controls">
              <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
              <div className="view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><FiGrid /></button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><FiList /></button>
              </div>
            </div>
          </div>
          {renderProductList()}
        </main>
      </div>
    </div>
  );
};

export default ProductCatalog;