// src/services/api.js

// 1. Lee la variable de entorno de Vercel (VITE_API_BASE_URL).
//    Si no existe (ej. en tu PC local), usa la URL local como fallback.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Una función wrapper para 'fetch' que incluye automáticamente el token de autenticación para peticiones JSON.
 * @param {string} endpoint El endpoint de la API al que se va a llamar.
 * @param {object} options Opciones de configuración para fetch (method, body, etc.).
 * @returns {Promise<any>} La respuesta de la API en formato JSON.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };

  try {
    // 2. Usa la variable BASE_URL
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    }
    return {}; 

  } catch (error) {
    console.error(`Fallo en la petición a ${endpoint}:`, error);
    throw error;
  }
};


/**
 * Una función wrapper para 'fetch' que maneja la subida de archivos (FormData).
 * (El resto de la función no cambia, pero ahora usará la BASE_URL correcta)
 */
export const fetchWithAuthFormData = async (endpoint, formData) => {
  const token = localStorage.getItem('token');
  
  const headers = {}; 
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // 3. Usa la variable BASE_URL
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT', // Generalmente PUT o POST para subidas
      headers: headers,
      body: formData, 
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error en la subida de archivo a ${endpoint}`);
    }
    return data;
  } catch (error) {
    console.error(`Fallo en la subida de archivo a ${endpoint}:`, error);
    throw error;
  }
};