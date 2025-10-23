import AppRouter from './router/AppRouter';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext'; // <-- IMPORTAR

function App() {
  return (
    <CartProvider>
      <ProductProvider> {/* <-- ENVOLVER */}
        <AppRouter />
      </ProductProvider>
    </CartProvider>
  );
}

export default App;