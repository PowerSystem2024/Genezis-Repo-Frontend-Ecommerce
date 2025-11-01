import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.scss'; // Crearemos este archivo a continuación

/**
 * Genera un array de números de página con lógica de "..."
 * @param {number} currentPage - La página actual
 * @param {number} totalPages - El total de páginas
 * @returns {Array<number|string>} - Array (ej. [1, '...', 4, 5, 6, '...', 10])
 */
const getPageNumbers = (currentPage, totalPages) => {
  // Cantidad de páginas a mostrar a cada lado de la actual
  const siblingCount = 1;
  // Cantidad total de números a mostrar (actual + siblings + first/last + ...)
  const totalPagesToShow = siblingCount * 2 + 5; 

  // Caso 1: Si el total de páginas es menor que los números que queremos mostrar
  if (totalPages <= totalPagesToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Caso 2: Elipsis al final
  if (currentPage <= siblingCount + 3) {
    const pages = [];
    for (let i = 1; i <= siblingCount + 4; i++) {
      pages.push(i);
    }
    pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  // Caso 3: Elipsis al inicio
  if (currentPage >= totalPages - (siblingCount + 2)) {
    const pages = [1, '...'];
    for (let i = totalPages - (siblingCount + 3); i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Caso 4: Elipsis en ambos lados
  return [
    1,
    '...',
    currentPage - siblingCount,
    currentPage,
    currentPage + siblingCount,
    '...',
    totalPages,
  ];
};


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  // No renderizar nada si solo hay una página
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination">
      <button 
        onClick={handlePrev} 
        disabled={currentPage === 1} 
        className="pagination__btn pagination__btn--prev"
        aria-label="Página anterior"
      >
        <FiChevronLeft />
        <span>Anterior</span>
      </button>

      <div className="pagination__numbers">
        {pageNumbers.map((num, index) =>
          num === '...' ? (
            <span key={`dots-${index}`} className="pagination__dots">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`pagination__btn pagination__btn--num ${
                num === currentPage ? 'active' : ''
              }`}
              aria-label={`Ir a la página ${num}`}
            >
              {num}
            </button>
          )
        )}
      </div>

      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages} 
        className="pagination__btn pagination__btn--next"
        aria-label="Página siguiente"
      >
        <span>Siguiente</span>
        <FiChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;