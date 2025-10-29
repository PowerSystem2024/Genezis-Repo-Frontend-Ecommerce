/**
 * Formatea un número como moneda en pesos argentinos (ARS) con separador de miles.
 * @param {number | string} value El valor numérico a formatear.
 * @returns {string} El valor formateado como string de moneda (ej: "$ 1.234,56").
 */
export const formatCurrency = (value) => {
  // Convertimos a número por si acaso llega como string
  const numberValue = Number(value);

  // Verificamos si es un número válido
  if (isNaN(numberValue)) {
    console.warn("formatCurrency recibió un valor no numérico:", value);
    // Devolvemos un valor por defecto o el original en caso de error
    return '$ 0,00';
  }

  // Usamos Intl.NumberFormat para un formateo localizado y robusto
  // 'es-AR' para Argentina (usa punto como separador de miles y coma para decimales)
  // 'style: 'currency', currency: 'ARS'' para el formato de moneda $
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2, // Siempre mostrar dos decimales
    maximumFractionDigits: 2,
  }).format(numberValue);
};

// Puedes exportar otras funciones útiles desde aquí si es necesario