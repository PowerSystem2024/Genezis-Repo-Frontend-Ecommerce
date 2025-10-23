import { fetchWithAuth } from './api';

/**
 * Crea una preferencia de pago en Mercado Pago.
 * @param {Array<object>} items Los items del carrito que se van a comprar.
 * @returns {Promise<object>} La respuesta de la API, que debe incluir el init_point.
 */
export const createPaymentPreference = async (items) => {
  // Mapeamos los items a la estructura exacta que la API espera.
  const orderItems = items.map(item => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  // --- LOG DE DEPURACIÓN #3 ---
  // Verificamos el cuerpo (body) que vamos a enviar.
  const bodyPayload = { items: orderItems };
  console.log('createPaymentPreference: Enviando el siguiente payload:', bodyPayload);

  try {
    // Usamos fetchWithAuth, que se encargará de añadir el token.
    const data = await fetchWithAuth('/checkout/create_preference', {
      method: 'POST',
      body: JSON.stringify(bodyPayload),
    });
    return data;
  } catch (error) {
    // Este log nos ayudará a ver el error en el contexto de este servicio.
    console.error("Error específico al crear la preferencia de pago:", error);
    throw error;
  }
};