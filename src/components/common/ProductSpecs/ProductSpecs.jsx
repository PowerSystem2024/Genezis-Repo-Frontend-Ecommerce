import React from 'react';
import './ProductSpecs.scss';

/**
 * Componente para renderizar la tabla de especificaciones.
 * Recibe un objeto 'specs' del producto.
 */
const ProductSpecs = ({ specs }) => {

  // Si no hay specs o están vacías, no renderizamos nada.
  if (!specs || Object.keys(specs).length === 0) {
    return <p>No hay especificaciones disponibles para este producto.</p>;
  }

  return (
    <div className="product-specs-container">
      {/* Iteramos sobre el primer nivel de claves (ej. "CARACTERISTICAS GENERALES")
        Esto crea un grupo por cada clave.
      */}
      {Object.keys(specs).map(groupTitle => (
        <div key={groupTitle} className="spec-group">
          <h3 className="spec-group__title">{groupTitle}</h3>
          <table className="spec-group__table">
            <tbody>
              {/* Iteramos sobre el segundo nivel de claves (ej. "Modelo", "Socket")
                Esto crea una fila por cada par clave/valor.
              */}
              {Object.keys(specs[groupTitle]).map(specKey => (
                <tr key={specKey} className="spec-item">
                  <td className="spec-item__key">{specKey}</td>
                  <td className="spec-item__value">{specs[groupTitle][specKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ProductSpecs;