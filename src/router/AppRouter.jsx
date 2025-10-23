import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importación de componentes de Layout
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import CartSidebar from '../components/common/CartSidebar/CartSidebar';

// Importación de Páginas (Vistas)
import Home from '../pages/Home/Home';
import ProductCatalog from '../pages/ProductCatalog/ProductCatalog';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Cart from '../pages/Cart/Cart';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

// Importación para Rutas Protegidas
import ProtectedRoute from './ProtectedRoute';

// Componente temporal para la página de Checkout que vamos a proteger
const CheckoutPlaceholder = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <h2>Página de Checkout</h2>
    <p>Esta página solo es visible para usuarios autenticados.</p>
  </div>
);

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Routes>
          {/* --- Rutas Públicas --- */}
          {/* Estas rutas son accesibles para cualquier visitante. */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Rutas Protegidas --- */}
          {/* Estas rutas requieren que el usuario esté autenticado. */}
          <Route element={<ProtectedRoute />}>
            {/* Todas las rutas que coloques aquí adentro estarán protegidas. */}
            {/* Si un usuario no logueado intenta acceder, será redirigido a /login. */}
            <Route path="/checkout" element={<CheckoutPlaceholder />} />
            
            {/* En el futuro, aquí también irían las rutas del Dashboard: */}
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            {/* <Route path="/profile" element={<UserProfile />} /> */}
          </Route>
          
          {/* Puedes añadir una ruta para "Página no encontrada" al final */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;