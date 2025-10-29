import React from 'react';
import './BrandsCarousel.scss';

// --- Lista de Marcas con URLs (Placeholders) ---
// ⬇️ ¡Aquí es donde pondrás tus URLs reales! ⬇️
const brands = [
  { name: 'ASUS', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714631/12asus_jsjl4g.png' },
  { name: 'Logitech', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714632/2logitech_el2eju.png' },
  { name: 'CoolerMaster', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714631/9coolermaster_dww5es.png' },
  { name: 'MSI', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714632/7msi_vfglvj.png' },
  { name: 'Corsair', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714631/10corsair_k6054z.png' },
  { name: 'AMD', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714632/3amd_z8khyu.png' },
  { name: 'NVIDIA', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714632/5nvidia_true7g.png' },
  { name: 'Intel', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714632/4intel_ilt4r2.png' },
  { name: 'Kingston', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714635/1kingston_kj3ljj.png' },
  { name: 'Razer', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761715698/CITYPNG.COM_Razer_Gaming_Logo_HD_PNG_-_2000x2000_f3nbx0.png' },
  { name: 'hiksemi', src: 'https://res.cloudinary.com/diap9hbws/image/upload/v1761714631/8hiksemi_tymuec.png' },
];

// Duplicamos la lista para el efecto de loop infinito
const allBrands = [...brands, ...brands];

const BrandsCarousel = () => {
  return (
    <div className="brands-carousel" aria-hidden="true">
      <div className="brands-track">
        {allBrands.map((brand, index) => (
          <div className="brand-item" key={index}>
            {/* Ahora usamos la etiqueta <img> */}
            <img 
              src={brand.src} 
              alt={`${brand.name} logo`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsCarousel;