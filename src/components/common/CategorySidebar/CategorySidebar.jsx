import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import './CategorySidebar.scss';

const CategorySidebar = ({ categories, activeCategory, onCategorySelect }) => {
  return (
    <div className="category-sidebar">
      <h3 className="category-sidebar__title">Categorías</h3>
      <ul className="category-sidebar__list">
        <li 
          className={`category-item ${activeCategory === 'all' ? 'is-active' : ''}`}
          onClick={() => onCategorySelect('all')}
        >
          <span className="category-item__name">Todos los productos</span>
          <FiChevronRight />
        </li>
        {categories.map(category => (
          <li
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'is-active' : ''}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <span className="category-item__name">{category.name}</span>
            <FiChevronRight />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;