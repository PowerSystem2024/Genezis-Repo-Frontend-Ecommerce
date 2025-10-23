import AppRouter from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext'; // <-- IMPORTAR

function App() {
  return (
    <AuthProvider> {/* <-- ENVOLVER TODO */}
      <CartProvider>
        <ProductProvider>
          <AppRouter />
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;