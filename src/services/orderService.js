import { fetchWithAuth } from './api';

/**
 * Obtiene todas las órdenes del sistema (solo para Admin).
 * @returns {Promise<Array>} Una lista de todas las órdenes.
 */
export const getAllOrders = async () => {
  try {
    const responseData = await fetchWithAuth('/orders');
    
    // --- CORRECCIÓN AQUÍ ---
    // Verificamos si la respuesta tiene una propiedad 'orders' y es un array.
    // Si no, asumimos que la respuesta ES el array.
    if (Array.isArray(responseData.orders)) {
      return responseData.orders;
    }
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    // Si no es ninguna de las dos, devolvemos un array vacío para evitar errores.
    console.warn("La respuesta de getAllOrders no era un array o no contenía una propiedad 'orders'.");
    return [];

  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    throw error;
  }
};

/**
 * Crea una nueva orden manualmente (solo para Admin).
 * @param {object} orderData - Los datos completos de la orden.
 * @returns {Promise<object>} La orden recién creada.
 */
export const createOrder = async (orderData) => {
  try {
    const response = await fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de una orden específica (solo para Admin).
 * @param {number|string} orderId - El ID de la orden a actualizar.
 * @param {string} status - El nuevo estado de la orden.
 * @returns {Promise<object>} Un mensaje de éxito.
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetchWithAuth(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response;
  } catch (error) {
    console.error(`Error al actualizar el estado de la orden ${orderId}:`, error);
    throw error;
  }
};