// src/services/categoryService.js

const BASE_URL = 'https://backend-genezis.onrender.com/api';

/**
 * Obtiene todas las categorías de la API.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de categorías.
 */
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};