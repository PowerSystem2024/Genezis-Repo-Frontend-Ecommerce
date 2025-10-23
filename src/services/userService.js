import { fetchWithAuth, fetchWithAuthFormData } from './api';

/**
 * Actualiza los datos del perfil del usuario (nombre, email, etc.).
 * @param {object} userData - Objeto con los datos a actualizar.
 * @returns {Promise<object>} El objeto de usuario actualizado.
 */
export const updateUserProfile = async (userData) => {
  // Asumiendo que el endpoint es PUT /api/users/profile
  return await fetchWithAuth('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

/**
 * Sube y actualiza el avatar del usuario.
 * @param {File} avatarFile - El archivo de imagen seleccionado.
 * @returns {Promise<object>} El objeto de usuario actualizado con la nueva URL del avatar.
 */
export const updateUserAvatar = async (avatarFile) => {
  const formData = new FormData();
  // 'avatar' debe ser el nombre del campo que tu backend espera para el archivo.
  formData.append('avatar', avatarFile);

  // Asumiendo que el endpoint es PUT /api/users/profile/avatar
  return await fetchWithAuthFormData('/users/profile/avatar', formData);
};