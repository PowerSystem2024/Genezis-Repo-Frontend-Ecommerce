import AppRouter from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
// --- 1. IMPORTAMOS AuthProvider Y useAuth ---
import { AuthProvider, useAuth } from './context/AuthContext';
// --- 2. IMPORTAMOS NUESTRO NUEVO MODAL ---
import SessionExpiredModal from './components/common/SessionExpiredModal/SessionExpiredModal';

// --- 3. CREAMOS UN COMPONENTE INTERNO ---
// (Necesario porque useAuth solo funciona en componentes HIJOS de AuthProvider)
const AppContent = () => {
  // Obtenemos el estado del modal desde el contexto
  const { showExpiredModal } = useAuth();

  return (
    <>
      {/* 4. RENDERIZADO CONDICIONAL DEL MODAL */}
      {showExpiredModal && <SessionExpiredModal />}
      
      <CartProvider>
        <ProductProvider>
          <AppRouter />
        </ProductProvider>
      </CartProvider>
    </>
  );
}

function App() {
  return (
    <AuthProvider> {/* <-- ENVOLVER TODO */}
      {/* 5. RENDERIZAMOS EL CONTENIDO QUE USA EL CONTEXTO */}
      <AppContent />
    </AuthProvider>
  );
}

export default App;