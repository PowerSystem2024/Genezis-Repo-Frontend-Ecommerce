import React, { useState, useEffect } from 'react';
import {
  getAllProductsForAdmin, // <-- Asegúrate de que usa la versión de admin
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';
import { FiUploadCloud, FiImage } from 'react-icons/fi';
import { formatCurrency } from '../../../utils/formatCurrency';
import './AdminProducts.scss';

import GalleryManagerModal from './GalleryManagerModal';

// --- Subcomponente del Formulario (Modal) ---
// (No hay cambios en este subcomponente)
const ProductForm = ({ currentProduct, onSave, onCancel, categories }) => {
    const [product, setProduct] = useState(() => {
    const initialState = { name: '', description: '', price: '', stock: '', categoryID: '' };
    if (!currentProduct) return initialState;
    return {
      ...currentProduct,
      price: String(currentProduct.price || ''),
      stock: String(currentProduct.stock || ''),
      categoryID: currentProduct.categoryid || '',
    };
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentProduct?.coverimageurl || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productToSend = {
        ...product,
        price: parseFloat(product.price) || 0,
        stock: parseInt(product.stock, 10) || 0,
        categoryID: parseInt(product.categoryID, 10) || null
    };
    onSave(productToSend, imageFile);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{currentProduct ? 'Editar Producto' : 'Crear Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Imagen de Portada</label>
            <div className="image-uploader">
              <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
              <label htmlFor="image-upload" className="upload-area">
                {imagePreview ? (
                  <img src={imagePreview} alt="Vista previa" className="image-preview" />
                ) : (
                  <div className="upload-prompt">
                    <FiUploadCloud />
                    <span>Click para subir imagen</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="description" value={product.description} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input type="number" name="price" value={product.price} onChange={handleChange} required step="0.01" min="0" />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" name="stock" value={product.stock} onChange={handleChange} required min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select name="categoryID" value={product.categoryID} onChange={handleChange} required>
              <option value="">Seleccione una categoría</option>
              {Array.isArray(categories) && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Componente Principal de la Página ---
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); 
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const productsData = await getAllProductsForAdmin(); 
      const productsArray = Array.isArray(productsData) ? productsData : productsData?.products || [];
      setProducts(productsArray);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        await Promise.all([
          fetchProducts(),
          getAllCategories().then(setCategories)
        ]);
      }  finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- INICIO DE LA MODIFICACIÓN (Lógica del "Wizard") ---
  const handleSave = async (productData, imageFile) => {
    setError('');
    try {
      if (currentProduct && currentProduct.id) {
        // --- MODO EDICIÓN ---
        // 1. Actualizamos el producto
        const updatedProduct = await updateProduct(currentProduct.id, productData, imageFile);
        // 2. Actualizamos el estado local
        setProducts(products.map(p => (p.id === updatedProduct.id ? {...p, ...updatedProduct} : p)));
        // 3. Cerramos el modal de edición
        setIsFormOpen(false);
        setCurrentProduct(null);

      } else {
        // --- MODO CREACIÓN (El nuevo flujo) ---
        // 1. Creamos el producto
        const newProduct = await createProduct(productData, imageFile);
        // 2. Lo añadimos al estado local
        setProducts(prevProducts => [...prevProducts, newProduct]);
        // 3. Cerramos el modal de CREAR
        setIsFormOpen(false);
        // 4. Inmediatamente abrimos el modal de GALERÍA para el producto recién creado
        setCurrentProduct(newProduct); // Seteamos el producto actual
        setIsGalleryModalOpen(true); // Abrimos el modal de galería
        // No reseteamos currentProduct a null aquí
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message || 'Error al guardar el producto.');
      // Si falla, cerramos todo para evitar confusiones
      setIsFormOpen(false);
      setCurrentProduct(null);
    }
  };
  // --- FIN DE LA MODIFICACIÓN ---

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Error al eliminar el producto.');
        console.error(err);
      }
    }
  };
  
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
    setIsGalleryModalOpen(false);
  };

  const openGalleryModal = (product) => {
    setCurrentProduct(product);
    setIsGalleryModalOpen(true);
    setIsFormOpen(false);
  };
  
  const closeModal = () => {
    setIsFormOpen(false);
    setIsGalleryModalOpen(false);
    setCurrentProduct(null);
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando panel de administración...</p>;

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <div>
          <button onClick={() => { setCurrentProduct(null); setIsFormOpen(true); }}>
            + Crear Producto
          </button>
        </div>
      </div>

      {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}

      {isFormOpen && (
        <ProductForm
          currentProduct={currentProduct}
          onSave={handleSave}
          onCancel={closeModal}
          categories={categories}
        />
      )}
      
      {isGalleryModalOpen && currentProduct && (
        <GalleryManagerModal
          productId={currentProduct.id}
          onClose={closeModal}
        />
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td className="image-cell">
                  <img src={product.coverimageurl} alt={product.name} className="product-table-image" />
                </td>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td className="actions-cell">
                  <button onClick={() => openEditModal(product)}>Editar</button>
                  <button className="gallery-btn" onClick={() => openGalleryModal(product)}>
                    <FiImage title="Gestionar Galería" />
                  </button>
                  <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;