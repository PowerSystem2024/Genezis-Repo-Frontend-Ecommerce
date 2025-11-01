import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getAllCategories } from '../../services/categoryService';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import CategorySidebar from '../../components/common/CategorySidebar/CategorySidebar';
import FilterSidebar from '../../components/common/FilterSidebar/FilterSidebar';
import { FiGrid, FiList, FiMenu, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import './ProductCatalog.scss';

const ProductCatalog = () => {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // ... (sin cambios aquí)
    const fetchCategories = async () => { try { setLoadingCategories(true); const data = await getAllCategories(); setCategories(data); } catch (err) { console.error("Error al cargar categorías:", err); } finally { setLoadingCategories(false); } };
    fetchCategories();
  }, []);
  
  useEffect(() => {
    // ... (sin cambios aquí)
    const params = new URLSearchParams(location.search);
    const searchFromURL = params.get('search');
    if (searchFromURL) {
      setSearchTerm(searchFromURL);
    }
  }, [location.search]);

  const filteredAndSortedProducts = useMemo(() => {
    // ... (sin cambios en la lógica de filtrado)
    let result = [...products];
    if (activeCategory !== 'all') { result = result.filter(p => p.categoryid === activeCategory); }
    if (searchTerm) { result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())); }
    switch (sortOrder) {
      case 'price-asc': result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case 'price-desc': result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      default: break;
    }
    return result;
  }, [products, activeCategory, searchTerm, sortOrder]);

  const handleCategorySelect = (categoryId) => { setActiveCategory(categoryId); setIsFilterSidebarOpen(false); };
  
  const renderProductList = () => {
    // ... (sin cambios aquí)
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
      <FilterSidebar isOpen={isFilterSidebarOpen} onClose={() => setIsFilterSidebarOpen(false)}>
        <CategorySidebar categories={categories} activeCategory={activeCategory} onCategorySelect={handleCategorySelect} />
      </FilterSidebar>
      
      <div className="catalog-container">
        <aside className="desktop-filters">
          <CategorySidebar categories={categories} activeCategory={activeCategory} onCategorySelect={handleCategorySelect} />
        </aside>

        <main className="product-list-container">
          <div className="mobile-filter-buttons">
            <button onClick={() => setIsFilterSidebarOpen(true)}><FiMenu /> Categorías</button>
            {/* --- 1. AÑADIMOS CLASE AL BOTÓN DE FILTROS --- */}
            <button className="btn-filters-mobile"><FiFilter /> Filtros</button>
          </div>
          
          <div className="product-list-header">
            <h1>{categories.find(c => c.id === activeCategory)?.name || 'Todos los productos'}</h1>
            <div className="search-control">
              <FiSearch />
              <input 
                type="text"
                placeholder="Buscar en esta categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <button onClick={() => setSearchTerm('')}><FiX /></button>}
            </div>
            <div className="controls">
              <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
              <div className="view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><FiGrid /></button>
                {/* --- 2. AÑADIMOS CLASE AL BOTÓN DE LISTA --- */}
                <button className={`btn-view-list ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
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