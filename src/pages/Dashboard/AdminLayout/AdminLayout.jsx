import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiList, FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.scss';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirigir al home después del logout
  };

  const displayName = user ? (user.firstName || user.firstname || user.name || user.email || '') : '';

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Admin Panel</h3>
          <p className="sidebar-welcome">Bienvenido{displayName ? `, ${displayName}` : ','}</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/orders" className="nav-link">
            <FiList />
            <span>Órdenes</span>
          </NavLink>
          <NavLink to="/admin/products" className="nav-link">
            <FiGrid />
            <span>Productos</span>
          </NavLink>
          <NavLink to="/admin/users" className="nav-link">
            <FiUsers />
            <span>Usuarios</span>
          </NavLink>
          <NavLink to="/admin/profile" className="nav-link">
            <FiUser />
            <span>Mi Perfil</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      <main className="admin-content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;