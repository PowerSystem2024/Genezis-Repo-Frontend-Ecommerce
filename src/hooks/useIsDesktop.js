import { useState, useEffect } from 'react';

// Definimos el breakpoint de tablet (md) que tienes en tu _variables.scss
// No podemos leer SASS en JS, así que lo definimos como una constante.
const TABLET_BREAKPOINT = 1024; 

/**
 * Hook personalizado que devuelve 'true' si el ancho de la ventana
 * es igual o mayor al breakpoint de la tablet (768px).
 */
export const useIsDesktop = () => {
  // Estado para guardar el resultado
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // window.matchMedia es más eficiente que un listener de 'resize'
    // Nos aseguramos de que solo se ejecute en el navegador
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);

    // Función para actualizar el estado basado en el media query
    const handleResize = () => {
      setIsDesktop(mediaQuery.matches);
    };

    // Settear el valor inicial al cargar
    handleResize();

    // Añadir el listener para cuando el tamaño de la ventana cambie
    mediaQuery.addEventListener('change', handleResize);

    // Limpieza al desmontar el componente
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  return isDesktop;
};