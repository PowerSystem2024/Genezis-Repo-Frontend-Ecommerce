import { fetchWithAuth } from './api';

// --- NUEVA FUNCIÓN ---
/**
 * Obtiene una lista de todos los usuarios (solo para Admin).
 * Basado en el endpoint: GET /api/users
 * @returns {Promise<Array>} Un array de objetos de usuario.
 */
export const getAllUsers = async () => {
  try {
    const data = await fetchWithAuth('/users');
    return data;
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw error;
  }
};

// --- NUEVA FUNCIÓN ---
/**
 * Desactiva un usuario (borrado lógico, solo para Admin).
 * Basado en el endpoint: DELETE /api/users/{id}
 * @param {number|string} userId El ID del usuario a desactivar.
 * @returns {Promise<object>} Un mensaje de éxito.
 */
export const deactivateUser = async (userId) => {
  try {
    const data = await fetchWithAuth(`/users/${userId}`, {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    console.error(`Error al desactivar el usuario ${userId}:`, error);
    throw error;
  }
};


/**
 * Actualiza los detalles del perfil del usuario (nombre y apellido).
 * Basado en el endpoint: PATCH /api/users/profile/details
 * @param {object} profileData - Un objeto con { firstName, lastName }.
 * @returns {Promise<object>} El objeto de usuario actualizado devuelto por la API.
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetchWithAuth('/users/profile/details', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    // Normalizamos la respuesta para asegurar que el frontend siempre reciba camelCase
    const returnedUser = response.user;
    if (!returnedUser) throw new Error("La respuesta de la API no contenía el objeto de usuario.");
    
    return {
        id: returnedUser.id,
        firstName: returnedUser.firstname || returnedUser.firstName,
        lastName: returnedUser.lastname || returnedUser.lastName,
        email: returnedUser.email,
        role: returnedUser.role
    };
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    throw error;
  }
};

/**
 * Cambia la contraseña del usuario autenticado.
 * Basado en el endpoint: PATCH /api/users/profile/password
 * @param {object} passwordData - Un objeto con { currentPassword, newPassword }.
 * @returns {Promise<object>} Un mensaje de éxito.
 */
export const changeUserPassword = async (passwordData) => {
  const payload = {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
  };

  try {
    const response = await fetchWithAuth('/users/profile/password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    throw error;
  }
};