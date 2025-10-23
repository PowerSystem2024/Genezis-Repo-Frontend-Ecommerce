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
 * Crea un nuevo producto enviando datos de texto y la imagen de portada en una sola petición.
 * @param {object} productData - Datos del producto (name, description, etc.).
 * @param {File} imageFile - El archivo de la imagen de portada.
 * @returns {Promise<object>} El producto recién creado.
 */
export const createProduct = async (productData, imageFile) => {
  const formData = new FormData();

  // 1. Añadimos todos los campos de texto al FormData
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  formData.append('stock', productData.stock);
  // ¡CORRECCIÓN IMPORTANTE! El backend espera 'categoryID', no 'categoryid'
  formData.append('categoryID', productData.categoryID); 

  // 2. Añadimos el archivo de imagen
  // El nombre 'productImage' debe coincidir EXACTAMENTE con el de la documentación de Swagger.
  if (imageFile) {
    formData.append('productImage', imageFile);
  }

  // 3. Realizamos la petición. NO usamos fetchWithAuth porque necesitamos que el navegador maneje el Content-Type
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // NO se define 'Content-Type', el navegador lo hará como 'multipart/form-data'
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al crear el producto.');
  }
  return data.product; // Asumiendo que la API devuelve { message, product }
};


export const updateProduct = async (id, productData) => {
  // La actualización de datos de texto puede seguir siendo JSON
  const dataToSend = {
    name: productData.name,
    description: productData.description,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock, 10),
    categoryID: parseInt(productData.categoryID, 10),
  };
  return await fetchWithAuth(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dataToSend),
  });
};


/**
 * Sube o actualiza la imagen de portada de un producto existente.
 * @param {number | string} productId - El ID del producto.
 * @param {File} imageFile - El archivo de imagen a subir.
 * @returns {Promise<object>} El objeto de producto actualizado.
 */
export const updateProductImage = async (productId, imageFile) => {
  const formData = new FormData();
  // El backend espera 'image' para la actualización, según la documentación anterior
  formData.append('image', imageFile); 
  
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/products/${productId}/image`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar la imagen.');
  }
  return data.product;
};


export const deleteProduct = async (id) => {
  return await fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  });
};