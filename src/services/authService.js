const BASE_URL = 'https://backend-genezis.onrender.com/api/auth';

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }
  return data; // Devuelve { token, user }
};

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al registrar el usuario');
  }
  return data;
};