import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../../components/common/HeroCarousel/HeroCarousel';
import ProductCardHome from '../../components/common/ProductCardHome/ProductCardHome';
import VisualCategoryGrid from '../../components/common/VisualCategoryGrid/VisualCategoryGrid';
import BrandsCarousel from '../../components/common/BrandsCarousel/BrandsCarousel';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../hooks/useCategories';
// --- 1. IMPORTACIÓN DE FiCpu ELIMINADA ---
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Home.scss';

// --- 2. IMPORTAR EL NUEVO COMPONENTE DE VIDEOS ---
import YoutubeGrid from '../../components/common/YoutubeGrid/YoutubeGrid';

// Mapeo de IDs de categoría (tu código original)
const categoryImageMap = {
  1: 'https://tecnovortex.com/wp-content/uploads/2024/09/msi-notebook-gamer.jpg', //notebook
  2: 'https://i.blogs.es/112dac/cpu/840_560.jpeg', //procesadores
  3: 'https://i.blogs.es/ab4820/placas-base-cabecera/650_1200.jpeg', //motherboards
  4: 'https://hiraoka.com.pe/media/mageplaza/blog/post/t/a/tarjeta-grafica-que-es-para-que-sirve-como-funciona.jpg', //placas de video
  5: 'https://media.kingston.com/kingston/opengraph/ktc-opengraph-blog-gaming-the-ultimate-ram-guide-for-gamers.jpg', //memorias ram
  6: 'https://d1q3zw97enxzq2.cloudfront.net/images/MP700_RENDER_24.width-702.format-webp.webp', //almacenamiento
  7: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761712424/unidad-fuente-alimentacion-equipo_qoogkg.png', //fuentes
  8: 'https://i.blogs.es/1a9ebd/guiamonitoresap/1366_2000.jpg', //monitores
  9: 'https://fhgamer.ar/wp-content/uploads/2024/01/f.webp', //pc escritorio
  10: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2024/08/perifericos-gaming-3860923.jpg?tf=3840x', //perifericos
};
const defaultCategoryImage = 'https://via.placeholder.com/300x200?text=Categoria';

const CATEGORIES_PER_PAGE = 5;

const Home = () => {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [currentPage, setCurrentPage] = useState(0);

  // (Tu código de 'featuredProducts' y 'getCategoryNameById' sin cambios)
  const featuredProducts = products.slice(0, 4);

  const getCategoryNameById = (id) => {
    if (categoriesLoading) return 'Cargando...';
    const numericId = parseInt(id, 10);
    const category = categories.find(cat => cat.id === numericId);
    return category ? category.name : 'Destacado';
  };

  // (Tu código de 'allVisualCategories', 'paginatedCategories', 'totalPages', 'goToNextPage' y 'goToPrevPage' sin cambios)
  const allVisualCategories = useMemo(() => {
    if (categoriesLoading || categoriesError || !Array.isArray(categories)) {
      return [];
    }
    return categories.map(cat => ({
      name: cat.name,
      link: `/products?categoryID=${cat.id}`,
      image: categoryImageMap[cat.id] || defaultCategoryImage,
    }));
  }, [categories, categoriesLoading, categoriesError]);

  const paginatedCategories = useMemo(() => {
    const startIndex = currentPage * CATEGORIES_PER_PAGE;
    const endIndex = startIndex + CATEGORIES_PER_PAGE;
    return allVisualCategories.slice(startIndex, endIndex);
  }, [allVisualCategories, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(allVisualCategories.length / CATEGORIES_PER_PAGE);
  }, [allVisualCategories.length]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  return (
    <div className="home-page">
      <HeroCarousel />

      {/* --- Sección Productos Destacados (Tu código sin cambios) --- */}
      <section className="featured-products">
         <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Los favoritos de nuestra comunidad</p>
          </div>
          {productsLoading ? (
            <p style={{ textAlign: 'center' }}>Cargando productos...</p>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCardHome
                  key={product.id}
                  product={product}
                  categoryName={getCategoryNameById(product.categoryid)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Sección Explorar Categorías (Tu código sin cambios) --- */}
      <section className="categories-section-home">
        <div className="container">
          <div className="section-header-wrapper">
            <div className="section-header">
              <h2>Categorías</h2>
              <p>Encuentra exactamente lo que necesitas</p>
            </div>
            {totalPages > 1 && (
              <div className="category-navigation">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className="category-nav-button prev"
                  aria-label="Categorías anteriores"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="category-nav-button next"
                  aria-label="Categorías siguientes"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>

          {categoriesLoading && <p style={{ textAlign: 'center' }}>Cargando categorías...</p>}
          {categoriesError && <p style={{ textAlign: 'center', color: '#f87171' }}>{categoriesError}</p>}
          {!categoriesLoading && !categoriesError && allVisualCategories.length > 0 && (
            <VisualCategoryGrid categories={paginatedCategories} />
          )}
           {!categoriesLoading && !categoriesError && allVisualCategories.length === 0 && (
             <p style={{ textAlign: 'center' }}>No hay categorías disponibles en este momento.</p>
           )}
        </div>
      </section>

      {/* --- Sección Marcas (Tu código sin cambios) --- */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <h2></h2>
          </div>
          <BrandsCarousel />
        </div>
      </section>

      {/* --- 3. SECCIÓN "Armá tu PC" REEMPLAZADA --- */}
      <section className="youtube-section">
        <div className="container">
          <div className="section-header">
            <h2>Últimas Tendencias</h2>
            <p>Mira lo último en Hardware Gamer</p>
          </div>
          <YoutubeGrid />
        </div>
      </section>
      {/* --- FIN DEL REEMPLAZO --- */}
    </div>
  );
};

export default Home;