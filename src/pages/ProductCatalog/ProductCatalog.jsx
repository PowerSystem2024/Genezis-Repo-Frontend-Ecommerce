import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { getAllCategories } from '../../services/categoryService';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import CategorySidebar from '../../components/common/CategorySidebar/CategorySidebar';
import FilterSidebar from '../../components/common/FilterSidebar/FilterSidebar';
// --- 1. IMPORTAR EL NUEVO COMPONENTE ---
import Pagination from '../../components/common/Pagination/Pagination';
import { FiGrid, FiList, FiMenu, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import './ProductCatalog.scss';

// --- 2. DEFINIR LA CONSTANTE DE PAGINACIÓN ---
const PRODUCTS_PER_PAGE = 9;

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

  // --- 3. AÑADIR ESTADO PARA LA PÁGINA ACTUAL ---
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // ... (sin cambios en fetchCategories)
    const fetchCategories = async () => { try { setLoadingCategories(true); const data = await getAllCategories(); setCategories(data); } catch (err) { console.error("Error al cargar categorías:", err); } finally { setLoadingCategories(false); } };
    fetchCategories();
  }, []);
  
  useEffect(() => {
    // ... (sin cambios en el manejo de 'search' de la URL)
    const params = new URLSearchParams(location.search);
    const searchFromURL = params.get('search');
    if (searchFromURL) {
      setSearchTerm(searchFromURL);
    }
  }, [location.search]);

  // --- 4. EFECTO PARA RESETEAR LA PÁGINA AL FILTRAR ---
  // Cuando el usuario cambia de categoría, busca o reordena,
  // debemos volver a la página 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm, sortOrder]);


  // Memo para la lista COMPLETA de productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    // ... (sin cambios en esta lógica)
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

  // --- 5. NUEVO MEMO PARA CALCULAR LA PAGINACIÓN ---
  // Derivamos la lista paginada y el total de páginas
  // a partir de la lista filtrada completa.
  const { paginatedProducts, totalPages } = useMemo(() => {
    const total = filteredAndSortedProducts.length;
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
    
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    
    const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);
    
    return { paginatedProducts, totalPages };
  }, [filteredAndSortedProducts, currentPage]); // Se recalcula si la lista filtrada o la página actual cambian

  // --- 6. NUEVO HANDLER PARA CAMBIAR DE PÁGINA ---
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Opcional: llevar al usuario al inicio de la lista de productos
    window.scrollTo({
      top: 0, // Ajusta si tienes un header sticky
      behavior: 'smooth',
    });
  };

  const handleCategorySelect = (categoryId) => { 
    setActiveCategory(categoryId); 
    setIsFilterSidebarOpen(false); 
  };
  
  const renderProductList = () => {
    // ... (sin cambios en los loaders/errors)
    if (productsLoading || loadingCategories) return <p>Cargando...</p>;
    if (productsError) return <p className="error-message">{productsError}</p>;

    // --- 7. MODIFICACIÓN: USAR LA LISTA PAGINADA ---
    return (
      <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
        {/* Usamos 'paginatedProducts' en lugar de 'filteredAndSortedProducts' */}
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map(product => {
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
          {/* ... (sin cambios en el header) ... */}
          <div className="product-list-header">
            <h1>{categories.find(c => c.id === activeCategory)?.name || 'Todos los productos'}</h1>
            
            <div className="mobile-filter-buttons">
              <button onClick={() => setIsFilterSidebarOpen(true)}><FiMenu /> Categorías</button>
              <button className="btn-filters-mobile"><FiFilter /> Filtros</button>
            </div>
            
            <div className="search-control">
              <FiSearch />
              <input 
                type="text"
                placeholder="Buscar en esta categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.g.target.value)}
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
                <button className={`btn-view-list ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
              </div>
            </div>
          </div>
          
          {renderProductList()}

          {/* --- 8. AÑADIR EL COMPONENTE DE PAGINACIÓN --- */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductCatalog;