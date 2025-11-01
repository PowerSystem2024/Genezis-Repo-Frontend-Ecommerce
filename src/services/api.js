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
      // --- INICIO DE MODIFICACIÓN ---
      // Interceptamos el error 401 (Unauthorized)
      if (response.status === 401) {
        // Disparamos un evento global que AuthContext escuchará
        window.dispatchEvent(new CustomEvent('sessionExpired'));
        // Lanzamos un error para detener la ejecución del código que llamó a esta función
        throw new Error('Sesión expirada');
      }
      // --- FIN DE MODIFICACIÓN ---

      const errorData = await response.json();
      throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    }
    return {}; 

  } catch (error) {
    // Si el error es el que lanzamos nosotros, no lo logueamos en consola
    if (error.message === 'Sesión expirada') {
      throw error;
    }
    console.error(`Fallo en la petición a ${endpoint}:`, error);
    throw error;
  }
};


/**
 * --- VERSIÓN MODIFICADA ---
 * Una función wrapper para 'fetch' que maneja la subida de archivos (FormData).
 * Ahora acepta un parámetro 'method' para ser reutilizable.
 * @param {string} endpoint El endpoint de la API.
 * @param {FormData} formData El objeto FormData que se enviará.
 * @param {string} method El método HTTP (ej. 'POST', 'PUT'). Por defecto 'POST'.
 * @returns {Promise<any>} La respuesta de la API en formato JSON.
 */
export const fetchWithAuthFormData = async (endpoint, formData, method = 'POST') => {
  const token = localStorage.getItem('token');
  
  const headers = {}; 
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: headers,
      body: formData, 
    });
        
    if (!response.ok) {
      // --- INICIO DE MODIFICACIÓN ---
      // Interceptamos el error 401 (Unauthorized)
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('sessionExpired'));
        throw new Error('Sesión expirada');
      }
      // --- FIN DE MODIFICACIÓN ---

      const data = await response.json();
      throw new Error(data.message || `Error en la subida de archivo a ${endpoint}`);
    }
    
    return await response.json();

  } catch (error) {
    if (error.message === 'Sesión expirada') {
      throw error;
    }
    console.error(`Fallo en la subida de archivo a ${endpoint}:`, error);
    throw error;
  }
};