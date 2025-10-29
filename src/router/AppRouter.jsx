import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- LAYOUTS ---
import AdminLayout from '../pages/Dashboard/AdminLayout/AdminLayout';

// --- COMPONENTES DE LAYOUT PÚBLICO ---
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import CartSidebar from '../components/common/CartSidebar/CartSidebar';

// --- PÁGINAS PÚBLICAS Y DE USUARIO ---
import Home from '../pages/Home/Home';
import ProductCatalog from '../pages/ProductCatalog/ProductCatalog';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Cart from '../pages/Cart/Cart';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Checkout from '../pages/Checkout/Checkout';
import PaymentSuccess from '../pages/PaymentStatus/PaymentSuccess';
import PaymentFailure from '../pages/PaymentStatus/PaymentFailure';

// --- PÁGINAS DE ADMINISTRACIÓN ---
import ManageOrders from '../pages/Dashboard/ManageOrders/ManageOrders';
import AdminProducts from '../pages/Dashboard/AdminProducts/AdminProducts';
import AdminProfile from '../pages/Dashboard/AdminProfile/AdminProfile';
// --- 1. IMPORTAR LA NUEVA PÁGINA ---
import ManageUsers from '../pages/Dashboard/AdminUsers/ManageUsers';


// --- COMPONENTES DE RUTAS ---
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// --- Componente Intermediario para el Layout Público ---
const MainLayoutWrapper = () => (
  <div className="app-layout">
    <Navbar />
    <CartSidebar />
    {/* Cambia <main> por un div con clase para controlar el crecimiento */}
    <div className="main-content">
      <Outlet />
    </div>
    <Footer />
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* --- GRUPO DE RUTAS PÚBLICAS Y DE USUARIO --- */}
      <Route element={<MainLayoutWrapper />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Route>

      {/* --- GRUPO DE RUTAS DE ADMINISTRADOR --- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<ManageOrders />} /> 
          <Route path="products" element={<AdminProducts />} />
          <Route path="profile" element={<AdminProfile />} />
          {/* --- 2. AÑADIR LA NUEVA RUTA --- */}
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;