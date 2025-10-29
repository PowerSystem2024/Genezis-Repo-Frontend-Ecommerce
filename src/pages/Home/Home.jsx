import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../../components/common/HeroCarousel/HeroCarousel';
import ProductCardHome from '../../components/common/ProductCardHome/ProductCardHome';
import VisualCategoryGrid from '../../components/common/VisualCategoryGrid/VisualCategoryGrid';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../hooks/useCategories'; // Ya estabas importando esto
import { FiCpu, FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Íconos de flechas
import './Home.scss';

// Mapeo de IDs de categoría (esperados de la API) a las imágenes hardcodeadas
// **IMPORTANTE**: Asegúrate de que estos IDs coincidan con los IDs reales de tu API.
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
const defaultCategoryImage = 'https://via.placeholder.com/300x200?text=Categoria'; // Imagen por defecto

// Configuración de paginación ajustada
const CATEGORIES_PER_PAGE = 5; // 1 grande + 6 pequeñas

const Home = () => {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual de categorías

  // Selecciona los primeros 8 productos para destacar
  const featuredProducts = products.slice(0, 8);

  // Función auxiliar para obtener el nombre de la categoría por ID
  const getCategoryNameById = (id) => {
    if (categoriesLoading) return 'Cargando...';
    const numericId = parseInt(id, 10);
    const category = categories.find(cat => cat.id === numericId);
    return category ? category.name : 'Destacado';
  };

  // Genera la lista completa de categorías visuales (nombre, link, imagen)
  const allVisualCategories = useMemo(() => {
    if (categoriesLoading || categoriesError || !Array.isArray(categories)) {
      return []; // Devuelve vacío si está cargando, hay error o no es un array
    }
    // Mapea las categorías de la API a la estructura necesaria
    return categories.map(cat => ({
      name: cat.name,
      link: `/products?categoryID=${cat.id}`,
      // Busca la imagen en el mapeo, si no existe, usa la default
      image: categoryImageMap[cat.id] || defaultCategoryImage,
    }));
  }, [categories, categoriesLoading, categoriesError]); // Dependencias del useMemo

  // Calcula las categorías a mostrar en la página actual
  const paginatedCategories = useMemo(() => {
    const startIndex = currentPage * CATEGORIES_PER_PAGE;
    const endIndex = startIndex + CATEGORIES_PER_PAGE;
    return allVisualCategories.slice(startIndex, endIndex);
  }, [allVisualCategories, currentPage]);

  // Calcula el número total de páginas necesarias
  const totalPages = useMemo(() => {
    return Math.ceil(allVisualCategories.length / CATEGORIES_PER_PAGE);
  }, [allVisualCategories.length]);

  // Funciones para manejar el cambio de página (con useCallback para optimización)
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => (prev + 1 < totalPages ? prev + 1 : prev)); // No ir más allá de la última página
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : prev)); // No ir antes de la primera página
  }, []);

  return (
    <div className="home-page">
      <HeroCarousel />

      {/* --- Sección Productos Destacados --- */}
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

      {/* --- Sección Explorar Categorías --- */}
      <section className="categories-section-home">
        <div className="container">
          {/* Wrapper para el título y los botones de navegación */}
          <div className="section-header-wrapper">
            <div className="section-header">
              <h2>Explorá Nuestras Categorías</h2>
              <p>Encuentra exactamente lo que necesitas</p>
            </div>
            {/* Solo muestra las flechas si hay más de una página */}
            {totalPages > 1 && (
              <div className="category-navigation">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 0} // Deshabilitado en la primera página
                  className="category-nav-button prev"
                  aria-label="Categorías anteriores" // Accesibilidad
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1} // Deshabilitado en la última página
                  className="category-nav-button next"
                  aria-label="Categorías siguientes" // Accesibilidad
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>

          {/* Renderizado condicional de la grid o mensajes */}
          {categoriesLoading && <p style={{ textAlign: 'center' }}>Cargando categorías...</p>}
          {categoriesError && <p style={{ textAlign: 'center', color: '#f87171' }}>{categoriesError}</p>}
          {!categoriesLoading && !categoriesError && allVisualCategories.length > 0 && (
            // Pasa solo las categorías de la página actual al componente Grid
            <VisualCategoryGrid categories={paginatedCategories} />
          )}
           {/* Mensaje si la API no devuelve categorías o el mapeo falla */}
           {!categoriesLoading && !categoriesError && allVisualCategories.length === 0 && (
             <p style={{ textAlign: 'center' }}>No hay categorías disponibles en este momento.</p>
           )}
        </div>
      </section>

      {/* --- Sección Call to Action (Armá tu PC) --- */}
      <section className="cta-section">
         <div className="container">
          <div className="cta-content">
            <FiCpu className="cta-icon" />
            <h2>Armá tu PC a Medida</h2>
            <p>Seleccioná los componentes que quieras y creá la computadora de tus sueños con nuestro asistente de compatibilidad.</p>
            <Link to="/build-pc" className="cta-button">Empezar a armar</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;