import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    
    if (data.user && data.token) {
      // --- CORRECCIÓN CLAVE AQUÍ ---
      // Eliminamos la capa de normalización. Usamos el objeto 'data.user' directamente
      // ya que el backend ahora nos lo entrega en el formato camelCase correcto.
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Guardamos el objeto user tal como viene
      setToken(data.token);
      setUser(data.user); // Establecemos el objeto user tal como viene
    } else {
      throw new Error('Respuesta de login inválida desde el servidor.');
    }
  };

  const register = async (userData) => {
    await registerUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUserState = (updatedUserData) => {
    // Aquí también asumimos que la respuesta de actualización vendrá en camelCase
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const isAuthenticated = !!token;

  const value = { user, token, isAuthenticated, loading, login, register, logout, updateUserState };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};