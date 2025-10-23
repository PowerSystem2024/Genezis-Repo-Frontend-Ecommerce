import React, { useState, useEffect } from 'react';
import { getAllUsers, deactivateUser } from '../../../services/userService';
import { FiTrash2 } from 'react-icons/fi';
import './ManageUsers.scss';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllUsers();
        // Filtramos para mostrar solo los usuarios activos
        const activeUsers = data.filter(user => user.isActive === true);
        setUsers(activeUsers || []);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeactivate = async (userId) => {
    // Confirmación antes de una acción destructiva
    if (window.confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
      try {
        await deactivateUser(userId);
        // Eliminamos el usuario de la lista en la UI para un feedback instantáneo
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
      } catch (err) {
        setError(err.message || 'No se pudo desactivar el usuario.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        {/* Podríamos añadir un botón para 'Ver usuarios inactivos' en el futuro */}
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="cell-id">#{user.id}</td>
                  <td className="cell-name">{`${user.firstname || ''} ${user.lastname || ''}`.trim()}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge role--${user.role}`}>{user.role}</span></td>
                  <td>{formatDate(user.createdat)}</td>
                  <td className="cell-actions">
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDeactivate(user.id)}
                      title="Desactivar Usuario"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;