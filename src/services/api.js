const BASE_URL = 'https://backend-genezis.onrender.com/api';

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
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
    }

    // Algunas respuestas (como DELETE) pueden no tener cuerpo, manejamos ese caso.
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    }
    return {}; // Devuelve un objeto vacío si no hay JSON

  } catch (error) {
    console.error(`Fallo en la petición a ${endpoint}:`, error);
    throw error;
  }
};


/**
 * Una función wrapper para 'fetch' que maneja la subida de archivos (FormData).
 * @param {string} endpoint El endpoint de la API al que se va a llamar.
 * @param {FormData} formData El objeto FormData que contiene el archivo.
 * @returns {Promise<any>} La respuesta de la API en formato JSON.
 */
export const fetchWithAuthFormData = async (endpoint, formData) => {
  const token = localStorage.getItem('token');
  
  const headers = {}; // ¡No se establece Content-Type, el navegador lo hace!
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT', // Generalmente PUT o POST para subidas
      headers: headers,
      body: formData, // Se envía el objeto FormData directamente
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