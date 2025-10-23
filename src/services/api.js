const BASE_URL = 'https://backend-genezis.onrender.com/api';

/**
 * Una función wrapper para 'fetch' que incluye automáticamente el token de autenticación.
 * @param {string} endpoint El endpoint de la API al que se va a llamar (ej. '/checkout/create_preference').
 * @param {object} options Opciones de configuración para fetch (method, body, etc.).
 * @returns {Promise<any>} La respuesta de la API en formato JSON.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  // 1. Intentamos leer el token del localStorage.
  const token = localStorage.getItem('token');
  
  // --- LOG DE DEPURACIÓN #1 ---
  // Esto nos dirá si estamos encontrando el token.
  console.log('fetchWithAuth: Token leído de localStorage:', token);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 2. Si encontramos un token, lo añadimos al encabezado de Authorization.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Si no hay token, es importante saberlo.
    console.warn('fetchWithAuth: No se encontró token en localStorage. La petición irá sin autenticación.');
  }
  
  const config = {
    ...options,
    headers,
  };
  
  // --- LOG DE DEPURACIÓN #2 ---
  // Esto nos mostrará los encabezados exactos que se van a enviar.
  console.log('fetchWithAuth: Enviando petición con la siguiente configuración:', config);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Si la respuesta no es OK, intentamos leer el JSON de error.
    if (!response.ok) {
      const errorData = await response.json();
      console.error('fetchWithAuth: Error recibido de la API:', errorData);
      throw new Error(errorData.message || `Error en la petición: ${response.statusText}`);
    }

    // Si la respuesta es OK, devolvemos el JSON.
    return await response.json();

  } catch (error) {
    console.error('fetchWithAuth: Fallo en la petición fetch o al procesar la respuesta.', error);
    throw error; // Relanzamos el error para que el componente que llama lo pueda manejar.
  }
};