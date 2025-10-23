import React from 'react';
// 1. Añadir 'Navigate' que faltaba
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import CartSidebar from '../components/common/CartSidebar/CartSidebar';
// 2. Mantener UNA SOLA importación de AdminLayout
import AdminLayout from '../pages/Admin/AdminLayout/AdminLayout';

// Páginas
import Home from '../pages/Home/Home';
import ProductCatalog from '../pages/ProductCatalog/ProductCatalog';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Cart from '../pages/Cart/Cart';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Checkout from '../pages/Checkout/Checkout';
import PaymentSuccess from '../pages/PaymentStatus/PaymentSuccess';
import PaymentFailure from '../pages/PaymentStatus/PaymentFailure';

// Páginas de Administración
// 3. Eliminar la importación duplicada de aquí
import AdminProducts from '../pages/Admin/AdminProducts';
import AdminProfile from '../pages/Admin/AdminProfile';
import AdminOrders from '../pages/Admin/AdminOrders/AdminOrders';

// Rutas Protegidas
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          
          {/* Rutas Protegidas para usuarios logueados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          
          {/* Rutas Protegidas solo para Administradores */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;