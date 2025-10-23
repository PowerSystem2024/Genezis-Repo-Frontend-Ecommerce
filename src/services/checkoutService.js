import { fetchWithAuth } from './api';

/**
 * Crea una preferencia de pago en Mercado Pago.
 * @param {Array<object>} items Los items del carrito que se van a comprar.
 * @returns {Promise<object>} La respuesta de la API, que debe incluir el init_point.
 */
export const createPaymentPreference = async (items) => {
  const orderItems = items.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    price: parseFloat(item.price)
  }));

  try {
    const data = await fetchWithAuth('/checkout/create_preference', {
      method: 'POST',
      body: JSON.stringify({ items: orderItems }),
    });
    return data;
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error);
    throw error;
  }
};