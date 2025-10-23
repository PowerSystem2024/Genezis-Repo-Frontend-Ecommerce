import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.scss';

// Componente interno para el header del panel de admin
const AdminHeader = () => {
  return (
    <header className="admin-layout-header">
      <div className="header-content">
        <h1 className="header-title">Panel de Administración</h1>
        <nav className="header-nav">
          <NavLink to="/admin/products" end>Productos</NavLink>
          <NavLink to="/admin/orders">Órdenes</NavLink>
          <NavLink to="/admin/profile">Mi Perfil</NavLink>
        </nav>
      </div>
    </header>
  );
};

// Layout principal que envuelve las páginas de admin
const AdminLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-content">
        <Outlet /> {/* Aquí se renderizarán las páginas (AdminProducts, AdminOrders, etc.) */}
      </div>
    </div>
  );
};

export default AdminLayout;