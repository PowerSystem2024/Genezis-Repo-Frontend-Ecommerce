// src/services/authService.js
import { BASE_URL } from './api'; // <-- IMPORTAMOS LA URL CENTRAL

// Construimos la URL del servicio de autenticación
const AUTH_URL = `${BASE_URL}/auth`;

export const loginUser = async (credentials) => {
  const response = await fetch(`${AUTH_URL}/login`, { // <-- Usamos la nueva URL
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
  const response = await fetch(`${AUTH_URL}/register`, { // <-- Usamos la nueva URL
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