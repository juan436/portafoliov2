// portfolio/services/api/content.ts
import { API_URL } from './index';
import { translateAndAddToObject } from '../client/translation';

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
 * Traduce automáticamente el contenido a los idiomas soportados
 */
export const updateContent = async (section: string, data: any) => {
  try {
    // Definir los campos a traducir según la sección
    const fieldsToTranslate: Record<string, string[]> = {
      hero: ['title', 'subtitle', 'description'],
      about: ['paragraph1', 'paragraph2', 'paragraph3'],
      services: ['title', 'description'],
      contact: ['location'],
      projects: ['title', 'description', 'tags'],
      skills: ['name'],
      otherSkills: ['name'],
      experience: ['position', 'description', 'location']
    };

    // Si la sección tiene campos definidos para traducir
    if (fieldsToTranslate[section]) {
      if (Array.isArray(data)) {
        const translatedItems = await Promise.all(
          data.map(async (item) => {
            return await translateAndAddToObject(
              item,
              'es',
              ['en', 'fr', 'it'],
              fieldsToTranslate[section] as (keyof typeof item)[]
            );
          })
        );
        data = translatedItems;
      } else {
        data = await translateAndAddToObject(
          data,
          'es',
          ['en', 'fr', 'it'],
          fieldsToTranslate[section] as (keyof typeof data)[]
        );
      }
    }
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
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
