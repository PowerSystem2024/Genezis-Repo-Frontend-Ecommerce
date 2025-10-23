import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../../services/orderService'; // Asegúrate de que la ruta sea correcta
import './ManageOrders.scss';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null); // ID de la orden que se está actualizando

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllOrders();
        // Ordenamos las órdenes por ID descendente para mostrar las más nuevas primero
        const sortedData = data.sort((a, b) => b.id - a.id);
        setOrders(sortedData || []);
      } catch (err) {
        setError('No se pudieron cargar las órdenes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId); // Activa el loader/deshabilitado para esta fila
    try {
      // Llamamos al servicio para actualizar el estado en el backend
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      // Actualizamos el estado local con la respuesta consistente del backend
      setOrders(prevOrders => 
        prevOrders.map(o => (o.id === orderId ? { ...o, status: updatedOrder.status } : o))
      );
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      // Opcional: podrías añadir un estado para mostrar un toast/notificación de error
    } finally {
      setUpdatingStatus(null); // Desactiva el loader/deshabilitado
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  const getStatusClass = (status) => {
    if (!status) return 'status--default';
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'status--paid';
      case 'pending':
        return 'status--pending';
      case 'cancelled':
        return 'status--cancelled';
      case 'shipped':
        return 'status--shipped';
      default:
        return 'status--default';
    }
  };

  return (
    <div className="manage-orders-page">
      <div className="page-header">
        <h1>Gestión de Órdenes</h1>
        <button className="create-btn">+ Crear Orden Manual</button>
      </div>

      {loading && <p>Cargando órdenes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Total</th>
                <th>ID Pago</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="cell-id">#{order.id}</td>
                  <td className="cell-client">
                    {`${order.firstname || ''} ${order.lastname || ''}`.trim() || 'Usuario no disponible'}
                  </td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`status-select ${getStatusClass(order.status)}`}
                      disabled={updatingStatus === order.id}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagada</option>
                      <option value="shipped">Enviada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                  <td className="cell-total">${parseFloat(order.totalamount).toFixed(2)}</td>
                  <td>{order.paymentgatewayid || 'N/A'}</td>
                  <td>{formatDate(order.createdat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;