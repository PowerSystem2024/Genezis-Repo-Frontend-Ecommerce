import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import './AdminProducts.scss';

// --- Subcomponente del Formulario (Modal) ---
const ProductForm = ({ currentProduct, onSave, onCancel, categories }) => {
  // Función para inicializar el estado del formulario de forma segura
  const getInitialState = () => {
    if (!currentProduct) {
      return { name: '', description: '', price: '', stock: '', coverImageURL: '', categoryID: '' };
    }
    // Traduce los nombres de las propiedades del listado de productos
    // al formato que espera el formulario y la API de guardado.
    return {
      ...currentProduct,
      coverImageURL: currentProduct.coverimageurl || '', // de lowercase a camelCase
      categoryID: currentProduct.categoryid || '',       // de lowercase a camelCase
    };
  };
  
  const [product, setProduct] = useState(getInitialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{currentProduct ? 'Editar Producto' : 'Crear Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="description" value={product.description} onChange={handleChange} required />
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
            <label>URL de Imagen</label>
            <input type="text" name="coverImageURL" value={product.coverImageURL} onChange={handleChange} required />
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [productsData, categoriesData] = await Promise.all([getAllProducts(), getAllCategories()]);
        
        const productsArray = Array.isArray(productsData) ? productsData : productsData?.products || [];
        
        setProducts(productsArray);
        setCategories(categoriesData);

      } catch (err) {
        setError('No se pudieron cargar los datos. Intente recargar la página.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  const handleSave = async (productData) => {
    setError('');
    try {
      if (productData.id) {
        await updateProduct(productData.id, productData);
        // Al actualizar, reemplazamos el producto antiguo con el nuevo en la UI
        setProducts(products.map(p => (p.id === productData.id ? productData : p)));
      } else {
        const created = await createProduct(productData);
        // Añadimos el nuevo producto a la lista en la UI
        setProducts([...products, created]);
      }
      setIsFormOpen(false);
      setCurrentProduct(null);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError('Error al guardar el producto. Verifique los datos e intente de nuevo.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Error al eliminar el producto.');
      }
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando panel de administración...</p>;

  return (
    <div className="admin-products-container">
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <button onClick={() => { setCurrentProduct(null); setIsFormOpen(true); }}>
          + Crear Producto
        </button>
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