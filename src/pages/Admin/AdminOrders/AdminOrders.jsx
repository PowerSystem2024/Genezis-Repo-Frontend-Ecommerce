import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, createOrder } from '../../../services/orderService';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import './AdminOrders.scss';

// --- Componente del Formulario Modal para Crear Orden (COMPLETAMENTE REESCRITO) ---
const CreateOrderModal = ({ onSave, onCancel }) => {
  const [orderData, setOrderData] = useState({
    userId: '',
    status: 'paid', // 'paid' como valor por defecto
    totalAmount: '',
    paymentGatewayId: '',
  });
  const [items, setItems] = useState([{ productId: '', quantity: '', priceAtPurchase: '' }]);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: '', priceAtPurchase: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) { // Evita eliminar el último item
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalOrder = {
      ...orderData,
      totalAmount: parseFloat(orderData.totalAmount),
      userId: parseInt(orderData.userId, 10),
      items: items.map(item => ({
        productId: parseInt(item.productId, 10),
        quantity: parseInt(item.quantity, 10),
        priceAtPurchase: parseFloat(item.priceAtPurchase),
      })),
    };
    onSave(finalOrder);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h2>Crear Nueva Orden Manual</h2>
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-row">
            <div className="form-group">
              <label>ID de Usuario (userId)</label>
              <input type="number" name="userId" value={orderData.userId} onChange={handleOrderChange} required />
            </div>
            <div className="form-group">
              <label>Monto Total (totalAmount)</label>
              <input type="number" step="0.01" name="totalAmount" value={orderData.totalAmount} onChange={handleOrderChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Estado (status)</label>
              <select name="status" value={orderData.status} onChange={handleOrderChange}>
                <option value="paid">Pagada</option>
                <option value="pending">Pendiente</option>
                <option value="shipped">Enviada</option>
                <option value="delivered">Entregada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID de Pasarela (paymentGatewayId)</label>
              <input type="text" name="paymentGatewayId" value={orderData.paymentGatewayId} onChange={handleOrderChange} placeholder="Ej: Transferencia-123" />
            </div>
          </div>
          
          <hr className="form-divider" />
          
          <h4>Ítems de la Orden</h4>
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <input type="number" name="productId" placeholder="ID Producto" value={item.productId} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" name="quantity" placeholder="Cantidad" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" step="0.01" name="priceAtPurchase" placeholder="Precio de Compra" value={item.priceAtPurchase} onChange={(e) => handleItemChange(index, e)} required />
              <button type="button" className="remove-item-btn" onClick={() => removeItem(index)} disabled={items.length <= 1}>
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button type="button" className="add-item-btn" onClick={addItem}>
            <FiPlus /> Añadir Ítem
          </button>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="submit-btn">Crear Orden</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Componente Principal de la Página ---
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getAllOrders();
        setOrders(ordersData || []);
      } catch (err) {
        setError('No se pudieron cargar las órdenes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setError('Error al actualizar el estado.');
    }
  };
  
  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData);
      // Asumiendo que la API no devuelve la orden creada, volvemos a cargar todas
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders || []);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Error al crear la orden.');
    }
  };

  if (loading) return <p>Cargando órdenes...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-orders-container">
      <div className="admin-header">
        <h1>Gestión de Órdenes</h1>
        <button onClick={() => setIsModalOpen(true)}>+ Crear Orden Manual</button>
      </div>

      {isModalOpen && <CreateOrderModal onSave={handleCreateOrder} onCancel={() => setIsModalOpen(false)} />}
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>ID Usuario</th>
              <th>Estado</th>
              <th>Total</th>
              <th>ID Pago</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userid}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagada</option>
                    <option value="shipped">Enviada</option>
                    <option value="delivered">Entregada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </td>
                <td>${parseFloat(order.totalamount).toFixed(2)}</td>
                <td>{order.paymentgatewayid}</td>
                <td>{new Date(order.createdat).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;