import { fetchWithAuth } from './api';

const BASE_URL = 'https://backend-genezis.onrender.com/api';

// --- Funciones Públicas ---

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
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
    const response = await fetch(`${BASE_URL}/products/${id}`);
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
  const response = await fetch(`${BASE_URL}/products`, {
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
  const response = await fetch(`${BASE_URL}/products/${id}`, {
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
  return await fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  });
};

// La función 'updateProductImage' se ha eliminado porque 'updateProduct' ahora maneja la imagen.