import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

// --- NUEVO: Array para los logos del footer bottom ---
// Incluye 'name', 'src', y 'link' (opcional)
const paymentLogos = [
  { 
    name: 'Genezis', 
    src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761717814/Recurso_2_4x_gtbmxd.png', 
    //link: ' ' 
  },
  { 
    name: 'Soulware', 
    src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761717688/ISOLOGO_TRANSPARENTE_2_wmhs2m.png', 
    //link: ' ' 
  },
  { 
    name: 'Lycheed', 
    src: 'https://lucianocortez.com.ar/Profile/logoLycheedOS.png', 
    //link: ' ' 
  },
  // Puedes añadir más logos aquí si quieres
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* ... (Secciones superiores del footer sin cambios) ... */}
        <div className="footer__section footer__section--brand">
          <h3 className="footer__logo-text">GamerStore</h3>
          <p>Tu tienda de confianza para hardware y periféricos de última generación.</p>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Navegación</h4>
          <ul className="footer__list">
            <li><Link to="/" className="footer__link">Inicio</Link></li>
            <li><Link to="/products" className="footer__link">Productos</Link></li>
            <li><Link to="/contact" className="footer__link">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Seguinos</h4>
          <ul className="footer__list footer__list--social">
            <li><a href="https://www.instagram.com/genezis_devs/" className="footer__link">
              <i className="bi bi-instagram"></i></a></li>
            <li><a href="https://www.facebook.com/share/16avYte77r/" className="footer__link">
              <i className="bi bi-facebook"></i></a></li>
            <li><a href="https://www.youtube.com/@Genezis-TUP" className="footer__link">
              <i className="bi bi-youtube"></i></a></li>
          </ul>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR MODIFICADA --- */}
      <div className="footer__bottom">
        <div className="footer__bottom-container">
          <p className="footer__copyright">&copy; {currentYear} GamerStore. Todos los derechos reservados.</p>

          <div className="footer__logos">
            {paymentLogos.map((logo, index) => (
              logo.link ? (
                <a
                  key={index}
                  href={logo.link}
                  target="_blank" // Abrir en nueva pestaña
                  rel="noopener noreferrer" // Seguridad y SEO
                  className="footer__logo-link" // Clase opcional para el link si necesitas estilos
                  title={logo.name} // Texto que aparece al hacer hover
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    className="footer__logo-img"
                  />
                </a>
              ) : (
                // Si no hay link, solo la imagen con el title
                <img
                  key={index}
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="footer__logo-img"
                  title={logo.name} // Texto que aparece al hacer hover
                />
              )
            ))}
          </div>
        </div>
      </div>
      {/* --- FIN SECCIÓN MODIFICADA --- */}
    </footer>
  );
};

export default Footer;