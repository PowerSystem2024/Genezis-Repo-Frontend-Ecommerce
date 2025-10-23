import React from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../../components/common/HeroCarousel/HeroCarousel';
import ProductCardHome from '../../components/common/ProductCardHome/ProductCardHome';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../hooks/useCategories';
import { FiCpu } from 'react-icons/fi';
import './Home.scss';

const Home = () => {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  const featuredProducts = products.slice(0, 4);

  const categoryLinks = [
    { name: 'Procesadores', link: '/products?categoryID=2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2BUYHohIMYGl1krhhPE23lcUsYe3Tz4wJ3p8QP6zClAlmlji_vE051Wia_hvmz7ncQlndMDMSCmMILY82ZL9EU9CNxwZt43FQ0CX17yD3TOXH6VE3rtbvbqt1e3RpDEIGXarO2a3YjH2EVf1IhbhzMSS51R7c0WPSPcKSpBEFK8kMqhGDYIyK_vWb4kA3DJKEW2VsZOUoamVALZUBW3_xlOuCy7_66kRrgllqNHIq823Jq60cwW-Ouim3G15POjdqoUa8UeV6uQNy' },
    { name: 'Placas de Video', link: '/products?categoryID=4', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZSKsyL1VVaZNEqdW26qsatnQGGaNxJQM2-25rg_KSxYNJ3luHSwa1LcFOLg30MACuhurhvcuHmzYEmMXs3L68p_SO6gi5QtC9p-RhRRv58DTI1l3FqZRDtJ6gmT9-snC2byx0qTiAOM_EbLOQE7SrTyQaDSQApC2gBmQvYSpk9zEPgTNZzwYkV1HM2p5PdflJTIYhTldTddQfjzzvOlJqWw9Jrnla76Vc3FqjvVldVo4e6cEqXmu-VVZLsNXvxFRixPXHylMksnIu' },
    { name: 'Periféricos', link: '/products?categoryID=10', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQRFguxpd7AkYR0h1FY7PW2GbgkRK0Ro4GayaNHUoMFL9GQ8XbAEWku0Jhm1bhx2YUdYxP4efRorl0K5DZXU4svFhSmUXw--4YJdrj0q3R7ekQsmSvMx0K8gMAvpWEDwR13TeOsBn3CR2gorhfHoeiTCVaugUXUUdM0u0luG0kaTLqZQzTR3JpiVii70H7sQRdhp8Z8oHdgwELs4GvoK8rOyMsl7KJSOzK1bJ-UWmIFTb9OTNy291_TbYCgPzcnqdvwEcZzVdDm3D' },
    { name: 'Almacenamiento', link: '/products?categoryID=6', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz93DwvioFXGB3VsUJC0f5zze52NIyZF7hE791676LOl99QDGUGpm4Bw-Y7_OBhNSWm93AEzRl8mXPYUGtIJ-CEUwu4tE-5vXVBI_7UGWkMiwWEE5iCjQ9FeFuAnuPIXott4C3pdEUxnrzE_y-JvLeoauyDq0Cjqhnm-Jm11hXRn3cvTDTvnKFUoXfA3ByaNPeFxWhuBDr3XEYSpqOis9it0nzaRYYEOwMVQq8A2yTJDRKT22RF31QHWnyzcUI9Xc_CxBIXY8JE_oB' },
    { name: 'Memorias RAM', link: '/products?categoryID=5', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZq_4H7-M0AQBYgscMsqvX2qx232-vsDHCG70dr6T1unHPBcqKSOWwCLAU-yuPH060BlE3wciIlzu_II2VRqGZpbqIZaB1dzfm3BT-zdFOrcHqFI1qURxcdDsW0bK_EkTCZSrj5MG9eVSKJESxUpWpiHHX3wFRAZ26GQJMD9pg75kDK3J-WWUmRO3AhKi4aPJfIhWDbgJ4KMNivpub4sW3NUbaRQvWzeXfp7WiRPMXQ1xPPWLhS9Y7yACR88SFuJq5DVHLfUnC2zMH' },
  ];

  const getCategoryNameById = (id) => {
    if (categoriesLoading) return 'Cargando...';
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Destacado';
  };

  return (
    <div className="home-page">
      <HeroCarousel />
      
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Los favoritos de nuestra comunidad</p>
          </div>
          {productsLoading ? (
            <p style={{textAlign: 'center'}}>Cargando productos...</p>
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
      
      <section className="categories-section-home">
        <div className="container">
          <div className="section-header">
            <h2>Explorá Nuestras Categorías</h2>
            <p>Encuentra exactamente lo que necesitas</p>
          </div>
          <div className="categories-grid">
            {categoryLinks.map(cat => (
              <Link to={cat.link} key={cat.name} className="category-item">
                <img src={cat.image} alt={cat.name} />
                <div className="category-overlay">
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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