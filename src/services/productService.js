// src/services/productService.js
import { fetchWithAuth, BASE_URL, fetchWithAuthFormData } from './api'; // <-- Tu importación (está correcta)


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

// --- 1. FUNCIÓN AÑADIDA QUE FALTABA ---
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
// --- FIN FUNCIÓN AÑADIDA ---

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

  // --- 2. CORRECCIÓN: Usar fetchWithAuthFormData en lugar de fetch ---
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

  // --- 3. CORRECCIÓN: Usar fetchWithAuthFormData en lugar de fetch ---
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

// --- (Tus funciones de galería ya estaban correctas) ---

/**
 * (ADMIN) Sube una nueva imagen a la galería.
 */
export const uploadToGallery = async (productId, imageFile, altText = '') => {
  const formData = new FormData();
  formData.append('galleryImage', imageFile);
  formData.append('altText', altText);

  const data = await fetchWithAuthFormData(`/products/${productId}/gallery`, formData, 'POST');
  return data.image; // La API devuelve { message, image }
};

/**
 * (ADMIN) Elimina una imagen de la galería.
 */
export const deleteFromGallery = async (imageId) => {
  return await fetchWithAuth(`/products/gallery/${imageId}`, {
    method: 'DELETE',
  });
};