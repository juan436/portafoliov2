// portfolio/services/api/experience.ts
import { API_URL } from './index';
import { translateAndAddToObject } from '../translation';

/**
 * Obtiene todas las experiencias
 */
export const fetchExperiences = async () => {
  try {
    const response = await fetch(`${API_URL}/experience`);
    if (!response.ok) throw new Error('Error obteniendo experiencias');
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

/**
 * Crea una nueva experiencia con traducciones automáticas
 */
export const createExperience = async (experience: any) => {
  try {
    // Campos a traducir para experiencias
    const fieldsToTranslate = ['position', 'location', 'description'];
    
    // Generar traducciones automáticamente
    const experienceWithTranslations = await translateAndAddToObject(
      experience,
      'es',
      ['en', 'fr', 'it'],
      fieldsToTranslate
    );
    
    console.log("Experiencia con traducciones:", experienceWithTranslations);
    
    const response = await fetch(`${API_URL}/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experienceWithTranslations),
    });

    if (!response.ok) {
      throw new Error('Error creando experiencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating experience:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Actualiza una experiencia existente con traducciones automáticas
 */
export const updateExperience = async (id: string, experience: any) => {
  try {
    // Campos a traducir para experiencias
    const fieldsToTranslate = ['position', 'location', 'description'];
    
    // Generar traducciones automáticamente
    const experienceWithTranslations = await translateAndAddToObject(
      experience,
      'es',
      ['en', 'fr', 'it'],
      fieldsToTranslate
    );
    
    console.log("Experiencia actualizada con traducciones:", experienceWithTranslations);
    
    const response = await fetch(`${API_URL}/experience/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experienceWithTranslations),
    });

    if (!response.ok) {
      throw new Error('Error actualizando experiencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating experience:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Elimina una experiencia
 */
export const deleteExperience = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/experience/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error eliminando experiencia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting experience:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
