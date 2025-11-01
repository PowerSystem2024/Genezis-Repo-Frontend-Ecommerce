// src/services/categoryService.js
import { BASE_URL } from './api'; // <-- IMPORTAMOS LA URL CENTRAL

/**
 * Obtiene todas las categorías de la API.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de categorías.
 */
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`); // <-- Usamos la BASE_URL
    
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