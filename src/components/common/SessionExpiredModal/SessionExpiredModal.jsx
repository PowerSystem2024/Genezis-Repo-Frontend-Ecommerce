import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FiAlertTriangle } from 'react-icons/fi';
import './SessionExpiredModal.scss';

const SessionExpiredModal = () => {
  const { closeExpiredModal } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = () => {
    closeExpiredModal();
    navigate('/login');
  };

  return (
    <div className="session-modal-overlay">
      <div className="session-modal-content">
        <FiAlertTriangle className="session-modal-icon" />
        <h2 className="session-modal-title">Sesión Expirada</h2>
        <p className="session-modal-text">
          Tu sesión ha finalizado. Por favor, inicia sesión
          nuevamente para continuar.
        </p>
        <button onClick={handleRedirect} className="session-modal-btn">
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;