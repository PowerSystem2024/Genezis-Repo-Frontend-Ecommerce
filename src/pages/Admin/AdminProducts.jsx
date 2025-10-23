import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateProductImage 
} from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { FiUploadCloud } from 'react-icons/fi';
import './AdminProducts.scss';

// --- Subcomponente del Formulario (Modal) ---
const ProductForm = ({ currentProduct, onSave, onCancel, categories }) => {
  const [product, setProduct] = useState(() => {
    // ¡CORRECCIÓN IMPORTANTE! El backend espera 'categoryID'
    const initialState = { name: '', description: '', price: '', stock: '', categoryID: '' };
    if (!currentProduct) return initialState;
    return {
      ...currentProduct,
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
    onSave(product, imageFile);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{currentProduct ? 'Editar Producto' : 'Crear Producto'}</h2>
        <form onSubmit={handleSubmit} className="product-form-grid">
          <div className="form-group-image">
            <label>Imagen de Portada</label>
            <div className="image-uploader">
              <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} />
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

          <div className="form-fields">
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

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      const productsArray = Array.isArray(productsData) ? productsData : productsData?.products || [];
      setProducts(productsArray);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      await Promise.all([
        fetchProducts(),
        getAllCategories().then(setCategories)
      ]);
      setLoading(false);
    };
    loadData();
  }, []);
  
  const handleSave = async (productData, imageFile) => {
    setError('');
    
    try {
      // --- LÓGICA DE GUARDADO CORREGIDA ---
      if (currentProduct && currentProduct.id) {
        // --- MODO EDICIÓN ---
        // 1. Actualizar datos de texto
        await updateProduct(currentProduct.id, productData);
        let finalProduct = { ...currentProduct, ...productData };

        // 2. Si se subió una nueva imagen, actualizarla
        if (imageFile) {
          const updatedProductWithImage = await updateProductImage(currentProduct.id, imageFile);
          finalProduct.coverimageurl = updatedProductWithImage.coverimageurl;
        }

        // 3. Actualizar UI
        setProducts(products.map(p => (p.id === finalProduct.id ? finalProduct : p)));
        
      } else {
        // --- MODO CREACIÓN ---
        // 1. Enviar todo de una vez
        const newProduct = await createProduct(productData, imageFile);
        
        // 2. Actualizar UI
        setProducts([...products, newProduct]);
      }

      setIsFormOpen(false);
      setCurrentProduct(null);

    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message || 'Error al guardar el producto.');
    }
  };

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

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando panel de administración...</p>;

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <div>
          <Link to="/admin/profile" className="profile-link">Mi Perfil</Link>
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
          onCancel={() => { setIsFormOpen(false); setCurrentProduct(null); }}
          categories={categories}
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
                <td>
                  <img src={product.coverimageurl} alt={product.name} className="product-table-image" />
                </td>
                <td>{product.name}</td>
                <td>${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</td>
                <td>{product.stock}</td>
                <td className="actions-cell">
                  <button onClick={() => { setCurrentProduct(product); setIsFormOpen(true); }}>Editar</button>
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