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
    // Esta función está esperando exactamente la respuesta que tu API ahora provee
    const data = await loginUser(credentials);
    
    // Esta validación ahora será exitosa
    if (data.user && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Guardamos el objeto 'user' completo
      setToken(data.token);
      setUser(data.user); // Establecemos el objeto 'user' en el estado
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

  const isAuthenticated = !!token;

  const value = { user, token, isAuthenticated, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};