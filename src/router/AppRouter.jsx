import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- LAYOUTS ---
import AdminLayout from '../pages/Dashboard/AdminLayout/AdminLayout';

// --- COMPONENTES DE LAYOUT PÚBLICO ---
// No los importamos como un layout separado, sino los componentes que lo forman
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
// Las páginas del área de administración se movieron a pages/Dashboard
import ManageOrders from '../pages/Dashboard/AdminOrders/ManageOrders';
import AdminProducts from '../pages/Dashboard/AdminProducts/AdminProducts';
import AdminProfile from '../pages/Dashboard/AdminProfile/AdminProfile';

// --- COMPONENTES DE RUTAS ---
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// --- Componente Intermediario para el Layout Público ---
// Este componente envuelve todas las páginas que usan el Navbar y Footer.
const MainLayoutWrapper = () => (
  <>
    <Navbar />
    <CartSidebar />
    <main>
      <Outlet /> {/* Aquí se renderizarán las páginas anidadas */}
    </main>
    <Footer />
  </>
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
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;