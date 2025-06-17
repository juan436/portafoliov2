import { API_URL } from '../index';

/**
 * Obtiene otras habilidades
 */
export const fetchOtherSkills = async () => {
  const response = await fetch('/api/other-skills');
  return await response.json();
};

/**
 * Crea una nueva habilidad adicional
 */
export const createOtherSkill = async (skill: any) => {
  try {
    const skillToCreate = {
      name: skill.name
    };
    
    const response = await fetch(`${API_URL}/other-skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skillToCreate),
    });
    
    if (!response.ok) {
      throw new Error('Error creando habilidad adicional');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating other skill:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

/**
 * Actualiza una habilidad adicional existente
 */
export const updateOtherSkill = async (id: string, skill: any) => {
  try {
    const response = await fetch(`${API_URL}/other-skills/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    
    if (!response.ok) {
      throw new Error('Error actualizando habilidad adicional');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating other skill:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

/**
 * Elimina una habilidad adicional
 */
export const deleteOtherSkill = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/other-skills/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error eliminando habilidad adicional');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting other skill:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};
