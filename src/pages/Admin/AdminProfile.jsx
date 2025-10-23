import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, changeUserPassword } from '../../services/userService';
import './AdminProfile.scss';

const AdminProfile = () => {
  const { user, updateUserState } = useAuth();
  
  // Estado para el formulario de detalles, usando camelCase
  const [detailsForm, setDetailsForm] = useState({ firstName: '', lastName: '' });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsMessage, setDetailsMessage] = useState({ type: '', text: '' });
  
  // Estado para el formulario de contraseña
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Efecto para popular el formulario con los datos del usuario del contexto
  useEffect(() => {
    // El 'user' del contexto ahora siempre estará en camelCase gracias a la normalización
    if (user) {
      setDetailsForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetailsForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Envía la actualización de los detalles del perfil
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setDetailsLoading(true);
    setDetailsMessage({ type: '', text: '' });
    try {
      // El objeto que se envía al servicio ya está en camelCase
      const updatedUser = await updateUserProfile({
        firstName: detailsForm.firstName,
        lastName: detailsForm.lastName,
      });
      // Actualiza el estado global en AuthContext para reflejar el cambio en toda la app
      updateUserState(updatedUser); 
      setDetailsMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
    } catch (error) {
      setDetailsMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Envía el cambio de contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }
    if (!passwordForm.newPassword) {
        setPasswordMessage({ type: 'error', text: 'La nueva contraseña no puede estar vacía.' });
        return;
    }
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      await changeUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage({ type: 'success', text: '¡Contraseña cambiada con éxito!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Limpia el formulario
    } catch (error) {
      setPasswordMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="admin-profile-container">
      <h1>Mi Perfil</h1>
      
      <div className="profile-grid">
        {/* FORMULARIO DE DETALLES */}
        <div className="profile-section">
          <h3>Detalles de la Cuenta</h3>
          <form onSubmit={handleDetailsSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="firstName" value={detailsForm.firstName} onChange={handleDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input type="text" name="lastName" value={detailsForm.lastName} onChange={handleDetailsChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={user?.email || ''} disabled />
            </div>
            
            {detailsMessage.text && <p className={`message ${detailsMessage.type}`}>{detailsMessage.text}</p>}
            
            <button type="submit" disabled={detailsLoading}>
              {detailsLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* FORMULARIO DE CONTRASEÑA */}
        <div className="profile-section">
          <h3>Cambiar Contraseña</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Contraseña Actual</label>
              <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required />
            </div>
            
            {passwordMessage.text && <p className={`message ${passwordMessage.type}`}>{passwordMessage.text}</p>}
            
            <button type="submit" disabled={passwordLoading}>
              {passwordLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;