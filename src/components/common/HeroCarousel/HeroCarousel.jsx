import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './HeroCarousel.scss';

const carouselSlides = [
  {
    title: 'El Siguiente Nivel del Gaming',
    subtitle: 'Encontrá el hardware más potente y los periféricos de mejor calidad para dominar en cada partida.',
    buttonText: 'Ver Productos',
    link: '/products',
    imageUrl: 'https://www.mielectro.es/blog/wp-content/uploads/2024/10/Mejores-perifericos-gaming.jpg'
  },
  {
    title: 'Inmersión Total',
    subtitle: 'Siente cada detalle con nuestros periféricos de alta fidelidad.',
    buttonText: 'Explorar Periféricos',
    link: '/products?categoryID=10',
    imageUrl: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761713705/Generated_Image_October_29_2025_-_1_51AM_ojeaof.png'
  },
  {
    title: 'Potencia a tu Medida',
    subtitle: 'Crea la computadora de tus sueños con nuestro asistente de compatibilidad.',
    buttonText: 'Armar mi PC',
    link: '/build-pc',
    imageUrl: 'https://inteligenciaargentina.ar/storage/uploads/s7T1N3tXxrBYY03XH2DnlSR3aLIMiDEYwVVFdAYa.jpg'
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % carouselSlides.length);
  }, []);

  const goToPrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(goToNext, 5000);
    return () => clearInterval(slideInterval);
  }, [goToNext]);

  return (
    <section className="hero-carousel">
      <div className="carousel-wrapper">
        {carouselSlides.map((slide, index) => (
          <div 
            key={index} 
            className="carousel-item"
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
          >
            <img src={slide.imageUrl} alt={slide.title} className="carousel-image" />
            <div className="carousel-overlay">
              <div className="carousel-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to={slide.link} className="cta-button">{slide.buttonText}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={goToPrev} className="carousel-nav prev"><FiChevronLeft /></button>
      <button onClick={goToNext} className="carousel-nav next"><FiChevronRight /></button>

      <div className="carousel-indicators">
        {carouselSlides.map((_, index) => (
          <button 
            key={index}
            className={`indicator ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;