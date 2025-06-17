// portfolio/services/api/content.ts
import { API_URL } from './index';

/**
 * Obtiene todo el contenido del sitio
 */
export const fetchContent = async () => {
  try {
    const response = await fetch(`${API_URL}/content`);
    
    if (!response.ok) {
      throw new Error('Error al obtener contenido');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
};

/**
 * Actualiza una sección específica del contenido
 */
export const updateContent = async (section: string, data: any) => {
  try {
    // Crear un objeto con la sección como clave
    const payload = { [section]: data };
    
    const response = await fetch(`${API_URL}/content`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Error actualizando ${section}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    return { success: false, message: error.message };
  }
};
