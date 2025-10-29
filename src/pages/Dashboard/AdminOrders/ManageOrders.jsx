import React, { useState, useEffect } from 'react';
import { getAllOrders, getOrderById, updateOrderStatus } from '../../../services/orderService';
import OrderDetailModal from './OrderDetailModal';
import { formatCurrency } from '../../../utils/formatCurrency'; // <-- IMPORTAR
import './ManageOrders.scss';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllOrders();
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

  const handleViewDetails = async (orderId) => {
    if (selectedOrderDetails) return;

    setIsModalLoading(true);
    setSelectedOrderDetails({ id: orderId, items: [] });
    try {
      const detailedOrder = await getOrderById(orderId);
      setSelectedOrderDetails(detailedOrder);
    } catch (err) {
      console.error("Error al cargar detalle de la orden:", err);
      setError('No se pudo cargar el detalle de la orden.');
      setSelectedOrderDetails(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(o => (o.id === orderId ? { ...o, status: updatedOrder.status } : o))
      );
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
    } finally {
      setUpdatingStatus(null);
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
      case 'completed': case 'paid': return 'status--paid';
      case 'pending': return 'status--pending';
      case 'cancelled': return 'status--cancelled';
      case 'shipped': return 'status--shipped';
      default: return 'status--default';
    }
  };


  return (
    <div className="manage-orders-page">
      {selectedOrderDetails && (
        <OrderDetailModal
          order={selectedOrderDetails}
          isLoading={isModalLoading}
          onClose={() => setSelectedOrderDetails(null)}
        />
      )}

      <div className="page-header">
        <h1>Gestión de Órdenes</h1>
        {/* Funcionalidad crear orden manual pendiente */}
        {/* <button className="create-btn">+ Crear Orden Manual</button> */}
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
                <tr key={order.id} onClick={() => handleViewDetails(order.id)} className="clickable-row">
                  <td className="cell-id">#{order.id}</td>
                  <td className="cell-client">
                    {`${order.firstname || ''} ${order.lastname || ''}`.trim() || 'Usuario no disponible'}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // <-- MUY IMPORTANTE
                      className={`status-select ${getStatusClass(order.status)}`}
                      disabled={updatingStatus === order.id}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagada</option>
                      <option value="shipped">Enviada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                  {/* --- MODIFICACIÓN AQUÍ --- */}
                  <td className="cell-total">{formatCurrency(order.totalamount)}</td>
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