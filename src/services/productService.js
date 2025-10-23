import { fetchWithAuth } from './api';

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
  const dataToSend = {
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock, 10),
    coverImageURL: productData.coverImageURL, // Usa camelCase
    categoryID: parseInt(productData.categoryID, 10), // Usa camelCase
  };
  return await fetchWithAuth('/products', {
    method: 'POST',
    body: JSON.stringify(dataToSend),
  });
};

export const updateProduct = async (id, productData) => {
  const dataToSend = {
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock, 10),
    coverImageURL: productData.coverImageURL, // Usa camelCase
    categoryID: parseInt(productData.categoryID, 10), // Usa camelCase
  };

  return await fetchWithAuth(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dataToSend),
  });
};

export const deleteProduct = async (id) => {
  return await fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  });
};