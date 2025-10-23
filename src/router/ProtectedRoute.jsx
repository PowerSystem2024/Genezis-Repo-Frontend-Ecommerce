// src/router/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica el estado de autenticación (ej. al recargar la página),
  // mostramos un mensaje de carga para evitar un parpadeo.
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirige a /login.
  // 'replace' evita que el usuario pueda volver a la página protegida con el botón "atrás".
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el contenido de la ruta anidada (el componente real).
  return <Outlet />;
};

export default ProtectedRoute;