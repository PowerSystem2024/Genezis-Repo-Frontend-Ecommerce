// src/router/AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import Home from '../pages/Home/Home';

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Aquí añadiremos más rutas en el futuro */}
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;
