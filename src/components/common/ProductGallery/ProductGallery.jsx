import React, { useState, useEffect } from 'react';
import './ProductGallery.scss';

const ProductGallery = ({ coverImage, galleryImages = [] }) => {
  // Combinamos la imagen de portada y las de la galería en un solo array
  const [allImages, setAllImages] = useState([]);
  
  // La imagen seleccionada para mostrar en grande
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const images = [];
    // 1. Añadimos la imagen de portada
    if (coverImage) {
      images.push({ id: 'cover', imageurl: coverImage, alttext: 'Imagen principal' });
    }
    // 2. Añadimos las imágenes de la galería
    if (Array.isArray(galleryImages)) {
      images.push(...galleryImages);
    }
    
    setAllImages(images);
    
    // 3. Establecemos la primera imagen (la de portada) como la seleccionada
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [coverImage, galleryImages]);

  if (allImages.length === 0) {
    // Fallback por si no hay ninguna imagen
    return <div className="product-gallery-container empty"></div>;
  }

  return (
    <div className="product-gallery-container">
      <div className="gallery-main-image">
        <img src={selectedImage?.imageurl} alt={selectedImage?.alttext || 'Imagen de producto'} />
      </div>
      <div className="gallery-thumbnails">
        {allImages.map((image) => (
          <button
            key={image.id}
            className={`thumbnail-btn ${image.imageurl === selectedImage?.imageurl ? 'active' : ''}`}
            onClick={() => setSelectedImage(image)}
            aria-label={image.alttext || 'Ver imagen'}
          >
            <img src={image.imageurl} alt={image.alttext || 'Miniatura'} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;