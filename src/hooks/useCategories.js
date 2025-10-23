import { useState, useEffect } from 'react';
import { getAllCategories } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError('No se pudieron cargar las categorías.');
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  return { categories, loading, error };
};