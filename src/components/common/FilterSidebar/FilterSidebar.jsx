import React from 'react';
import { FiX } from 'react-icons/fi';
import './FilterSidebar.scss';

const FilterSidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      <div className={`filter-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="filter-sidebar__header">
          <h3>Filtros</h3>
          <button onClick={onClose} className="filter-sidebar__close-btn">
            <FiX />
          </button>
        </div>
        <div className="filter-sidebar__content">
          {children}
        </div>
      </div>
      <div 
        className={`filter-sidebar__overlay ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
      />
    </>
  );
};

export default FilterSidebar;