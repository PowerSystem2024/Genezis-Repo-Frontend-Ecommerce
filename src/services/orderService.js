import { fetchWithAuth } from './api'; // Asegúrate de que la ruta a 'api.js' sea correcta

/**
 * Obtiene todas las órdenes del sistema (solo para Admin).
 * Se espera que la API devuelva directamente un array de objetos de orden.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de órdenes.
 */
export const getAllOrders = async () => {
  try {
    // fetchWithAuth ya parsea el JSON, así que 'data' será nuestro array de órdenes.
    const data = await fetchWithAuth('/orders');
    return data;
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    // Relanzamos el error para que el componente que lo llama pueda manejarlo.
    throw error;
  }
};

/**
 * Crea una nueva orden manualmente (solo para Admin).
 * @param {object} orderData - Los datos completos de la orden, incluyendo los items.
 * @returns {Promise<object>} La orden recién creada devuelta por la API.
 */
export const createOrder = async (orderData) => {
  try {
    const newOrder = await fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return newOrder;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de una orden específica (solo para Admin).
 * @param {number|string} orderId - El ID de la orden a actualizar.
 * @param {string} status - El nuevo estado en minúsculas (ej. 'shipped', 'paid').
 * @returns {Promise<object>} La orden actualizada devuelta por la API.
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const responseData = await fetchWithAuth(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    // Basado en tu captura, la API devuelve { message, order }, por lo que extraemos 'order'.
    if (responseData && responseData.order) {
      return responseData.order;
    }
    // Si la respuesta no tiene la estructura esperada, lanzamos un error.
    throw new Error('La respuesta de la API no contenía el objeto de la orden actualizada.');
  } catch (error) {
    console.error(`Error al actualizar el estado de la orden ${orderId}:`, error);
    throw error;
  }
};

/**
 * Obtiene el historial de órdenes del usuario actualmente autenticado.
 * @returns {Promise<Array>} Un array con las órdenes del usuario.
 */
export const getMyOrders = async () => {
  try {
    const data = await fetchWithAuth('/orders/my-orders');
    return data;
  } catch (error) {
    console.error('Error al obtener mis órdenes:', error);
    throw error;
  }
};

/**
 * Obtiene el detalle completo de una orden específica.
 * @param {number|string} orderId - El ID de la orden.
 * @returns {Promise<object>} El objeto de la orden con todos sus detalles e items.
 */
export const getOrderById = async (orderId) => {
  try {
    const data = await fetchWithAuth(`/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error(`Error al obtener la orden ${orderId}:`, error);
    throw error;
  }
};