import { fetchWithAuth } from './api';

/**
 * Actualiza los detalles del perfil del usuario (nombre y apellido).
 * Basado en el endpoint: PATCH /api/users/profile/details
 * @param {object} profileData - Un objeto con { firstName, lastName }.
 * @returns {Promise<object>} El objeto de usuario actualizado devuelto por la API.
 */
export const updateUserProfile = async (profileData) => {
  try {
    // El payload ya está en camelCase, perfecto para la API.
    const response = await fetchWithAuth('/users/profile/details', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    // La API devuelve una estructura { user: {...} }, extraemos el objeto user.
    // Asumimos que la respuesta del update también puede venir con minúsculas y la normalizamos
    const returnedUser = response.user;
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