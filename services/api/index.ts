// portfolio/services/api/index.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Re-exportar todas las funciones de los módulos específicos
export * from './projects';
export * from './content';
export * from './experience';
export * from './skills';
