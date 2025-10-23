// src/services/api.js

const BASE_URL = 'https://backend-genezis.onrender.com/api';

/**
 * Una función wrapper para 'fetch' que incluye automáticamente el token de autenticación.
 * @param {string} endpoint El endpoint de la API al que se va a llamar (ej. '/checkout/create_preference').
 * @param {object} options Opciones de configuración para fetch (method, body, etc.).
 * @returns {Promise<any>} La respuesta de la API en formato JSON.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Preparamos los headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permite sobrescribir o añadir otros headers si es necesario
  };

  // Si tenemos un token, lo añadimos al header de Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Construimos la configuración final para fetch
  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  const data = await response.json();
  if (!response.ok) {
    // Si la API devuelve un mensaje de error, lo usamos. Si no, un mensaje genérico.
    throw new Error(data.message || `Error en la petición a ${endpoint}`);
  }

  return data;
};