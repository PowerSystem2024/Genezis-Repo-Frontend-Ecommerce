// src/services/productService.js
import { fetchWithAuth, BASE_URL,fetchWithAuthFormData } from './api'; // <-- IMPORTAMOS LA URL CENTRAL Y fetchWithAuth


// --- Funciones Públicas ---

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`); // <-- Usamos la BASE_URL
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`); // <-- Usamos la BASE_URL
    if (!response.ok) {
      if (response.status === 404) throw new Error('Producto no encontrado');
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// --- Funciones Protegidas (Admin) ---

/**
 * Crea un nuevo producto enviando datos de texto y la imagen en una sola petición multipart/form-data.
 * @param {object} productData - Datos del producto (name, description, etc.).
 * @param {File} imageFile - El archivo de la imagen de portada.
 * @returns {Promise<object>} El producto recién creado.
 */
export const createProduct = async (productData, imageFile) => {
  const formData = new FormData();

  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  formData.append('stock', productData.stock);
  formData.append('categoryID', productData.categoryID); 

  if (imageFile) {
    formData.append('productImage', imageFile);
  }

  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/products`, { // <-- Usamos la BASE_URL
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al crear el producto.');
  }
  return data.product;
};

/**
 * Actualiza un producto existente. Puede actualizar solo texto, o texto e imagen a la vez.
 * @param {number|string} id - El ID del producto a actualizar.
 * @param {object} productData - Los datos de texto del producto.
 * @param {File|null} imageFile - El nuevo archivo de imagen (o null si no se cambia).
 * @returns {Promise<object>} El producto actualizado.
 */
export const updateProduct = async (id, productData, imageFile) => {
  const formData = new FormData();

  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  formData.append('stock', productData.stock);
  formData.append('categoryID', productData.categoryID);

  if (imageFile) {
    formData.append('productImage', imageFile);
  }

  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/products/${id}`, { // <-- Usamos la BASE_URL
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar el producto.');
  }
  return data.product;
};

/**
 * Elimina un producto.
 * @param {number|string} id - El ID del producto a eliminar.
 * @returns {Promise<object>} Un mensaje de éxito.
 */
export const deleteProduct = async (id) => {
  // fetchWithAuth ya tiene la BASE_URL, solo pasamos el endpoint
  return await fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  });
};

// --- INICIO DE NUEVAS FUNCIONES ---

/**
 * Sube una nueva imagen a la galería de un producto.
 * @param {string|number} productId El ID del producto.
 * @param {File} imageFile El archivo de imagen a subir.
 * @param {string} altText El texto alternativo (opcional).
 * @returns {Promise<object>} El objeto de la imagen recién creada.
 */
export const uploadToGallery = async (productId, imageFile, altText = '') => {
  const formData = new FormData();
  formData.append('galleryImage', imageFile);
  formData.append('altText', altText);

  // Llama a la API usando POST
  const data = await fetchWithAuthFormData(`/products/${productId}/gallery`, formData, 'POST');
  return data.image; // La API devuelve { message, image }
};

/**
 * Elimina una imagen de la galería de un producto.
 * @param {string|number} imageId El ID de la imagen (de la tabla productimages).
 * @returns {Promise<object>} Un mensaje de éxito.
 */
export const deleteFromGallery = async (imageId) => {
  return await fetchWithAuth(`/products/gallery/${imageId}`, {
    method: 'DELETE',
  });
};
// --- FIN DE NUEVAS FUNCIONES ---