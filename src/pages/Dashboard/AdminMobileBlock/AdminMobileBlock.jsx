import React from 'react';
import { Link } from 'react-router-dom';
import { FiMonitor, FiArrowLeft } from 'react-icons/fi';
import './AdminMobileBlock.scss';

const AdminMobileBlock = () => {
  return (
    <div className="admin-mobile-block">
      <div className="admin-mobile-block__content">
        <FiMonitor className="admin-mobile-block__icon" />
        <h1 className="admin-mobile-block__title">Panel no disponible</h1>
        <p className="admin-mobile-block__text">
          El panel de administración está diseñado para una mejor experiencia
          en pantallas más grandes.
        </p>
        <p className="admin-mobile-block__text">
          Por favor, ingrese desde una tablet o computadora.
        </p>
        <Link to="/" className="admin-mobile-block__link">
          <FiArrowLeft />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default AdminMobileBlock;