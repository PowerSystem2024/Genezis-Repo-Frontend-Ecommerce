// src/services/productService.js

const BASE_URL = 'https://backend-genezis.onrender.com/api';

/**
 * Obtiene todos los productos de la API.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de productos.
 */
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Obtiene un solo producto por su ID.
 * @param {string | number} id El ID del producto a obtener.
 * @returns {Promise<Object>} Una promesa que resuelve al objeto del producto.
 */
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      // Si el producto no se encuentra, la API debería devolver un 404.
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};