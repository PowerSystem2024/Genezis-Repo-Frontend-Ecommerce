// src/router/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import Home from '../pages/Home/Home';
import ProductCatalog from '../pages/ProductCatalog/ProductCatalog';
import ProductDetail from '../pages/ProductDetail/ProductDetail'; // <-- 1. IMPORTAR

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductCatalog />} />
          {/* 2. AÑADIR RUTA DINÁMICA */}
          {/* El ':' indica que 'productId' es un parámetro dinámico */}
          <Route path="/products/:productId" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;