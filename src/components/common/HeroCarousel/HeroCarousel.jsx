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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCExUsgJXSueZZhZL88Q1BFTP-ZHEVDCLU1DxmBV7vYaMsLkEUXkSDjjjIK1ZotKF9POMZUH9tHtDuxB_u7AmyGSFjew7b1UNRxNyYmAA4AY-8CVWZEy5I2at4dwnDSoAr77hvxLVoHQ-Im8FbLpT0bJhSUfqO1MtHgfX3s2rriPEJxhMshrzmvhiEJCgKQyr27MiI5V3KVPO-WQmFy2Oo489X5sed6XLdVQroJX6aqHIul7Sa0SvdHjPCohtH8sAD-XfN5Urrwrlk-'
  },
  {
    title: 'Inmersión Total',
    subtitle: 'Siente cada detalle con nuestros periféricos de alta fidelidad.',
    buttonText: 'Explorar Periféricos',
    link: '/products?categoryID=10',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe7syGF4WBIZj1k8Tg14DnaTJIl08hapB9f7VFsFWjlzUZmNYF-Wqq__1TRAB_bC-kxN_sg8_ouGz8jYExaKj9Tf4JJpMSrZPOncLcF134QqyauR-XRQk-s0wo25WKNTDow5UYYY1ImURXNeLkmfWAMgIUqf5pZQjXzlf2mEgtPRbcr6bjFbOQ7FSsPaISuZfjbxcW7wnNOzL6aRhM_uBNoTuY5dyMXQqPId4JbIeJYFkpKv1rehhTnKWSdgojv8uF99eEDefbqmrg'
  },
  {
    title: 'Potencia a tu Medida',
    subtitle: 'Crea la computadora de tus sueños con nuestro asistente de compatibilidad.',
    buttonText: 'Armar mi PC',
    link: '/build-pc',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPYPQstNI33wuKrv78mQjR4aV17b50YBCbTFZyg_Cox5ae7V4gQu34pjm_5fDEBqitY0qLSMb8dobogWSMb97Gk6D2gnEkOJgXSsFmPYNiNOlQm0hMzhl9ZV-mTiRUEabbTsqe-snzikCQg7vNdgqwOzkizyPNT2RgGLn3shOEmmwS25lb0ijgdEkpgPvpWf3IS94HL6t9VkuWBsCty6X34NnKPnuCleyBDnL7uqt5AHBoixo8eIm3rRVtFg2j6bOxbNDf1ILi13GL'
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