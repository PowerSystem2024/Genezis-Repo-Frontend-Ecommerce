import React, { useState, useEffect } from 'react';
import { getProductById, uploadToGallery, deleteFromGallery } from '../../../services/productService';
import { FiUploadCloud, FiTrash2, FiX, FiLoader } from 'react-icons/fi';
import './GalleryManagerModal.scss'; // Crearemos este archivo SCSS

const GalleryManagerModal = ({ productId, onClose }) => {
  const [productName, setProductName] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // 1. Cargar la galería del producto al abrir el modal
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError('');
        const product = await getProductById(productId);
        setProductName(product.name);
        setImages(product.gallery || []);
      } catch (err) {
        setError('No se pudo cargar la galería: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [productId]);

  // 2. Manejador para subir una nueva imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const newImage = await uploadToGallery(productId, file, 'Imagen de galería');
      setImages(prevImages => [...prevImages, newImage]);
    } catch (err) {
      setError('Error al subir la imagen: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = null; // Resetea el input
    }
  };

  // 3. Manejador para eliminar una imagen
  const handleImageDelete = async (imageId) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta imagen?')) return;
    
    setError('');
    try {
      await deleteFromGallery(imageId);
      setImages(prevImages => prevImages.filter(img => img.id !== imageId));
    } catch (err) {
      setError('Error al eliminar la imagen: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content gallery-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Gestionar Galería</h2>
          <button onClick={onClose} className="close-btn"><FiX /></button>
        </div>
        <div className="modal-body">
          <h3 className="product-title">{productName}</h3>
          {error && <p className="error-message">{error}</p>}
          
          <div className="gallery-grid">
            {/* Imágenes existentes */}
            {images.map(image => (
              <div key={image.id} className="gallery-item">
                <img src={image.imageurl} alt={image.alttext} />
                <button 
                  className="delete-image-btn"
                  onClick={() => handleImageDelete(image.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            {/* Botón de subida */}
            <label className="gallery-uploader">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading ? <FiLoader className="loader-icon" /> : <FiUploadCloud />}
              <span>{uploading ? 'Subiendo...' : 'Añadir imagen'}</span>
            </label>
          </div>
          
          {loading && !uploading && <p>Cargando galería...</p>}
        </div>
      </div>
    </div>
  );
};

export default GalleryManagerModal;