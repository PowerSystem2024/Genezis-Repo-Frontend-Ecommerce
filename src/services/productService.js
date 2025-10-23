// La URL base de tu API desplegada en Render
const BASE_URL = 'https://backend-genezis.onrender.com/api';

/**
 * Obtiene todos los productos de la API.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de productos.
 */
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    
    // Si la respuesta no es exitosa (ej. status 404 o 500), lanzamos un error.
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Capturamos cualquier error (de red o lanzado por nosotros) y lo mostramos en consola.
    console.error("Error fetching products:", error);
    // Relanzamos el error para que el componente que llama a esta función pueda manejarlo.
    throw error;
  }
};