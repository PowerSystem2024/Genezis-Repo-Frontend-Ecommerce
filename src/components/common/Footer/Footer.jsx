import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section footer__section--brand">
          <h3 className="footer__logo">GamerStore</h3>
          <p>Tu tienda de confianza para hardware y periféricos de última generación.</p>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Navegación</h4>
          <ul className="footer__list">
            <li><Link to="/" className="footer__link">Inicio</Link></li>
            <li><Link to="/products" className="footer__link">Productos</Link></li>
            <li><Link to="/build-pc" className="footer__link">Armá tu PC</Link></li>
            <li><Link to="/contact" className="footer__link">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Soporte</h4>
          <ul className="footer__list">
            <li><Link to="/faq" className="footer__link">Preguntas Frecuentes</Link></li>
            <li><Link to="/terms" className="footer__link">Términos y Condiciones</Link></li>
            <li><Link to="/privacy" className="footer__link">Política de Privacidad</Link></li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Seguinos</h4>
          <ul className="footer__list footer__list--social">
            <li><a href="#" className="footer__link">FB</a></li>
            <li><a href="#" className="footer__link">TW</a></li>
            <li><a href="#" className="footer__link">IG</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {currentYear} GamerStore. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;