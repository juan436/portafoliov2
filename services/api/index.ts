// Función para determinar la URL base para las llamadas API
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usa la URL actual
    return window.location.origin;
  }
  // En el servidor, usa la variable de entorno o un valor por defecto
  return process.env.NEXT_PUBLIC_API_URL || 'https://jvillegas-portafolio.jvserver.com';
};

export const API_URL = `${getBaseUrl()}/api`;

// Re-exportar todas las funciones de los módulos específicos
export * from './projects';
export * from './content';
export * from './experience';
export * from './skills';
