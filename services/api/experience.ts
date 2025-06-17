// portfolio/services/api/experience.ts
import { API_URL } from './index';

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
 * Crea una nueva experiencia
 */
export const createExperience = async (experience: any) => {
  try {
    const response = await fetch(`${API_URL}/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experience),
    });
    
    if (!response.ok) {
      throw new Error('Error creando experiencia');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating experience:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Actualiza una experiencia existente
 */
export const updateExperience = async (id: string, experience: any) => {
  try {
    const response = await fetch(`${API_URL}/experience/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experience),
    });
    
    if (!response.ok) {
      throw new Error('Error actualizando experiencia');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating experience:', error);
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
  }
};
