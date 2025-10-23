import { fetchWithAuth, fetchWithAuthFormData } from './api';

const BASE_URL = 'https://backend-genezis.onrender.com/api';

// --- Funciones Públicas ---

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Producto no encontrado');
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// --- Funciones Protegidas (Admin) ---

export const createProduct = async (productData) => {
  // Se envían solo los datos de texto. La imagen se sube después.
  const dataToSend = {
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock, 10),
    categoryID: parseInt(productData.categoryID, 10),
  };
  return await fetchWithAuth('/products', {
    method: 'POST',
    body: JSON.stringify(dataToSend),
  });
};

export const updateProduct = async (id, productData) => {
  // Se envían solo los datos de texto. La imagen se sube después.
  const dataToSend = {
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock, 10),
    categoryID: parseInt(productData.categoryID, 10),
  };
  return await fetchWithAuth(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dataToSend),
  });
};

/**
 * Sube o actualiza la imagen de portada de un producto.
 * @param {number | string} productId - El ID del producto.
 * @param {File} imageFile - El archivo de imagen a subir.
 * @returns {Promise<object>} El objeto de producto actualizado con la nueva URL de imagen.
 */
export const updateProductImage = async (productId, imageFile) => {
  const formData = new FormData();
  // 'image' debe ser el nombre del campo que tu backend espera (ej. upload.single('image'))
  formData.append('productImage', imageFile); 
  
  // Usamos la función especial para FormData de nuestro api.js y el endpoint PUT
  return await fetchWithAuthFormData(`/products/${productId}/image`, formData);
};

export const deleteProduct = async (id) => {
  return await fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  });
};