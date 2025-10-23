import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import CartSidebar from '../components/common/CartSidebar/CartSidebar';

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
import AdminProducts from '../pages/Admin/AdminProducts';

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
          <Route element={<AdminRoute />}>
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;