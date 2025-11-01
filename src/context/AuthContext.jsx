import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // <-- 1. IMPORTAR useCallback
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
  
  // --- 2. NUEVO ESTADO PARA EL MODAL ---
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // ... (sin cambios en la función login)
    const data = await loginUser(credentials);
    
    if (data.user && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } else {
      throw new Error('Respuesta de login inválida desde el servidor.');
    }
  };

  const register = async (userData) => {
    // ... (sin cambios en la función register)
    await registerUser(userData);
  };

  // --- 3. ENVOLVEMOS LOGOUT EN useCallback ---
  // Esto asegura que la función no se recree en cada render
  // y nuestro 'useEffect' listener funcione correctamente.
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []); // Dependencias vacías, la función es estable

  // --- 4. NUEVA FUNCIÓN PARA CERRAR EL MODAL ---
  const closeExpiredModal = () => {
    setShowExpiredModal(false);
  };

  // --- 5. NUEVO LISTENER DE EVENTOS GLOBALES ---
  useEffect(() => {
    const handleSessionExpired = () => {
      // Usamos 'logout' que ya está definido y es estable
      logout(); 
      // Mostramos el modal
      setShowExpiredModal(true); 
    };

    // Escuchamos el evento que disparamos desde api.js
    window.addEventListener('sessionExpired', handleSessionExpired);

    // Limpiamos el listener al desmontar
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [logout]); // El listener depende de la función logout

  const updateUserState = (updatedUserData) => {
    // ... (sin cambios en la función updateUserState)
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const isAuthenticated = !!token;

  // --- 6. EXPONEMOS LOS NUEVOS VALORES ---
  const value = { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    login, 
    register, 
    logout, 
    updateUserState,
    showExpiredModal, // <-- Nuevo
    closeExpiredModal // <-- Nuevo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // ... (sin cambios aquí)
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};