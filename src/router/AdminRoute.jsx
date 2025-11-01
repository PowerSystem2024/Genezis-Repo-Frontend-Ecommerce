import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIsDesktop } from '../hooks/useIsDesktop'; // <-- 1. IMPORTAR EL HOOK
import AdminMobileBlock from '../pages/Dashboard/AdminMobileBlock/AdminMobileBlock'; // <-- 2. IMPORTAR EL BLOQUEADOR

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const isDesktop = useIsDesktop(); // <-- 3. LLAMAR AL HOOK

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Validación de autenticación y rol (sin cambios)
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // --- 4. AÑADIR NUEVA LÓGICA DE BLOQUEO ---
  // Si está autenticado como admin, PERO NO es desktop...
  if (!isDesktop) {
    return <AdminMobileBlock />; // Muestra la pantalla de bloqueo
  }

  // Si pasó todas las validaciones (auth, rol, y desktop), muestra el panel
  return <Outlet />;
};

export default AdminRoute;