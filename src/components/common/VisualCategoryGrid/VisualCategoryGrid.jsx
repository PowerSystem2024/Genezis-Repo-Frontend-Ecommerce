import React from 'react';
import { Link } from 'react-router-dom';
import './VisualCategoryGrid.scss'; // Importaremos los estilos específicos

// Este componente recibe la lista de categorías a mostrar
const VisualCategoryGrid = ({ categories }) => {
  // Asegurémonos de que categories sea un array antes de mapear
  if (!Array.isArray(categories)) {
    console.warn("VisualCategoryGrid recibió 'categories' que no es un array:", categories);
    return null; // O mostrar un mensaje de error/carga
  }

  return (
    <div className="visual-categories-grid">
      {categories.map((cat) => (
        <Link to={cat.link} key={cat.name} className="visual-category-item">
          <img src={cat.image} alt={cat.name} className="visual-category-image" />
          <div className="visual-category-overlay">
            <h3 className="visual-category-name">{cat.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default VisualCategoryGrid;