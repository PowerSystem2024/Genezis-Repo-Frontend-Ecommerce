import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import './Home.scss';

// Datos de ejemplo adaptados a la estructura REAL (todo en minúsculas)
const featuredProducts = [
  { id: 1, name: 'Notebook ASUS ROG Strix G16', price: '5077.97', coverimageurl: 'https://picsum.photos/id/1/400/300', categoryid: 1 },
  { id: 2, name: 'Teclado HyperX Alloy Origins Core', price: '363.95', coverimageurl: 'https://picsum.photos/id/10/400/300', categoryid: 10 },
  { id: 3, name: 'Micrófono HyperX Quadcast S RGB', price: '492.20', coverimageurl: 'https://picsum.photos/id/24/400/300', categoryid: 10 },
  { id: 4, name: 'Mouse Glorious Model O 2 Wireless', price: '132.65', coverimageurl: 'https://picsum.photos/id/40/400/300', categoryid: 10 }
];

// Nombres de categorías para los productos destacados
const featuredCategories = {
    1: 'Notebooks',
    10: 'Periféricos'
}

const categories = [
    { name: 'Procesadores', image: 'https://picsum.photos/id/119/400/300' },
    { name: 'Placas de Video', image: 'https://picsum.photos/id/180/400/300' },
    { name: 'Periféricos', image: 'https://picsum.photos/id/219/400/300' },
    { name: 'Almacenamiento', image: 'https://picsum.photos/id/292/400/300' },
    { name: 'Memorias RAM', image: 'https://picsum.photos/id/319/400/300' },
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">El Siguiente Nivel del Gaming</h1>
          <p className="hero__subtitle">Encontrá el hardware más potente y los periféricos de mejor calidad para dominar en cada partida.</p>
          <Link to="/products" className="hero__cta">Ver Productos</Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="home-section">
        <h2 className="home-section__title">Productos Destacados</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              // CORRECCIÓN AQUÍ: Usamos 'categoryid' en minúsculas
              categoryName={featuredCategories[product.categoryid] || 'Destacado'}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-section">
          <h2 className="home-section__title">Explorá Nuestras Categorías</h2>
          <div className="category-grid">
              {categories.map(category => (
                  <Link to={`/products?category=${category.name}`} key={category.name} className="category-card">
                      <img src={category.image} alt={category.name} className="category-card__image" />
                      <div className="category-card__overlay">
                          <h3 className="category-card__name">{category.name}</h3>
                      </div>
                  </Link>
              ))}
          </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-section__title">Armá tu PC a Medida</h2>
        <p className="cta-section__subtitle">Seleccioná los componentes que quieras y creá la computadora de tus sueños con nuestro asistente de compatibilidad.</p>
        <Link to="/build-pc" className="cta-section__button">Empezar a armar</Link>
      </section>
    </div>
  );
};

export default Home;