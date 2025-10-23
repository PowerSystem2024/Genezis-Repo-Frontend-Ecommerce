import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, updateUserAvatar } from '../../services/userService';
import { FiCamera } from 'react-icons/fi';
import './AdminProfile.scss';

const AdminProfile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [message, setMessage] = useState('');

  // Sincroniza el formulario con los datos del usuario del contexto
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
      });
      setAvatarPreview(user.avatarUrl || `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=3b82f6&color=fff`);
    }
  }, [user]);

  // Maneja cambios en los inputs de texto
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Maneja la selección de un archivo de imagen
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Crea una URL local para la previsualización
    }
  };

  // Envía la actualización de los detalles del perfil
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoadingDetails(true);
    setMessage('');
    try {
      const updatedUser = await updateUserProfile(formData);
      setMessage('¡Perfil actualizado con éxito!');
      // TODO: Actualizar el estado global del usuario con 'updatedUser' si la API lo devuelve
    } catch (error) {
      setMessage(`Error al actualizar el perfil: ${error.message}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Envía el nuevo archivo de avatar
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;

    setLoadingAvatar(true);
    setMessage('');
    try {
      const updatedUser = await updateUserAvatar(avatarFile);
      setMessage('¡Avatar actualizado con éxito!');
      // TODO: Actualizar el estado global del usuario con 'updatedUser' para reflejar el nuevo avatar
    } catch (error) {
      setMessage(`Error al subir el avatar: ${error.message}`);
    } finally {
      setLoadingAvatar(false);
    }
  };

  return (
    <div className="admin-profile-container">
      <h1>Mi Perfil</h1>
      
      {message && <p className="message">{message}</p>}

      <div className="profile-grid">
        <div className="profile-avatar-section">
          <h3>Imagen de Perfil</h3>
          <div className="avatar-preview">
            <img src={avatarPreview} alt="Vista previa del Avatar" />
            <label htmlFor="avatar-upload" className="edit-icon">
              <FiCamera />
            </label>
          </div>
          <form onSubmit={handleAvatarSubmit}>
            <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            {avatarFile && (
              <button type="submit" disabled={loadingAvatar}>
                {loadingAvatar ? 'Subiendo...' : 'Guardar Imagen'}
              </button>
            )}
          </form>
        </div>

        <div className="profile-details-section">
          <h3>Detalles de la Cuenta</h3>
          <form onSubmit={handleDetailsSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="firstname" value={formData.firstname} onChange={handleDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input type="text" name="lastname" value={formData.lastname} onChange={handleDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleDetailsChange} disabled />
            </div>
            <button type="submit" disabled={loadingDetails}>
              {loadingDetails ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;