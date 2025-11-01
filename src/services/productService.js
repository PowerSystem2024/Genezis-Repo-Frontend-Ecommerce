// src/services/productService.js
import { fetchWithAuth, BASE_URL, fetchWithAuthFormData } from './api'; 


// --- Funciones Públicas ---

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`); // Ruta pública (para el catálogo)
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
    const response = await fetch(`${BASE_URL}/products/${id}`); // Ruta pública (para detalle)
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
 * (ADMIN) Obtiene TODOS los productos (activos e inactivos) para el panel.
 */
export const getAllProductsForAdmin = async () => {
  try {
    // Esta función usa fetchWithAuth (JSON) porque la ruta es protegida
    const data = await fetchWithAuth('/products/admin/all'); 
    return data;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    throw error;
  }
};

/**
 * (ADMIN) Crea un nuevo producto.
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

  const data = await fetchWithAuthFormData('/products', formData, 'POST');
  if (!data.product) {
    throw new Error(data.message || 'La API no devolvió el producto creado.');
  }
  return data.product;
};

/**
 * (ADMIN) Actualiza un producto.
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

  const data = await fetchWithAuthFormData(`/products/${id}`, formData, 'PUT');
  if (!data.product) {
    throw new Error(data.message || 'La API no devolvió el producto actualizado.');
  }
  return data.product;
};

/**
 * (ADMIN) Elimina (desactiva) un producto.
 */
export const deleteProduct = async (id) => {
  return await fetchWithAuth(`/products/${id}`, {
    method: 'DELETE',
  });
};

/**
 * (ADMIN) Sube una imagen a la galería.
 */
export const uploadToGallery = async (productId, imageFile, altText = '') => {
  const formData = new FormData();
  formData.append('galleryImage', imageFile);
  formData.append('altText', altText);

  const data = await fetchWithAuthFormData(`/products/${productId}/gallery`, formData, 'POST');
  return data.image; // La API devuelve { message, image }
};

// --- INICIO DE NUEVA FUNCIÓN ---
/**
 * (ADMIN) Solicita al backend que genere las especificaciones de IA para un producto.
 * @param {string|number} productId El ID del producto.
 * @returns {Promise<object>} El objeto de especificaciones (specs) recién generado.
 */
export const generateProductSpecs = async (productId) => {
  try {
    // Llama al nuevo endpoint POST
    const specsData = await fetchWithAuth(`/products/${productId}/generate-specs`, {
      method: 'POST',
      // No se necesita body, solo el token (que fetchWithAuth ya incluye)
    });
    return specsData; // Devuelve el objeto JSON de specs
  } catch (error) {
    console.error(`Error al generar specs para el producto ${productId}:`, error);
    throw error;
  }
};
// --- FIN DE NUEVA FUNCIÓN ---

/**
 * (ADMIN) Elimina una imagen de la galería.
 */
export const deleteFromGallery = async (imageId) => {
  return await fetchWithAuth(`/products/gallery/${imageId}`, {
    method: 'DELETE',
  });
};