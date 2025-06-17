// portfolio/services/api/skills.ts
import { API_URL } from './index';

/**
 * Obtiene todas las habilidades agrupadas por categoría
 */
export const fetchSkills = async () => {
  try {
    const frontendSkills = await fetchSkillsByCategory('frontend');
    const backendSkills = await fetchSkillsByCategory('backend');
    const databaseSkills = await fetchSkillsByCategory('database');
    const devopsSkills = await fetchSkillsByCategory('devops');
    
    return {
      frontend: frontendSkills,
      backend: backendSkills,
      database: databaseSkills,
      devops: devopsSkills
    };
  } catch (error) {
    console.error('Error:', error);
    return { frontend: [], backend: [], database: [], devops: [] };
  }
};

/**
 * Obtiene habilidades por categoría
 */
export const fetchSkillsByCategory = async (category: string) => {
  try {
    const response = await fetch(`${API_URL}/skills?category=${category}`);
    if (!response.ok) throw new Error(`Error obteniendo skills de ${category}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

/**
 * Crea una nueva habilidad
 */
export const createSkill = async (skill: any) => {
  try {
    console.log('Intentando crear skill:', skill);
    
    // Crear un objeto con solo los campos que el modelo espera
    const skillToCreate = {
      name: skill.name,
      icon: skill.icon,
      colored: skill.colored !== undefined ? skill.colored : false,
      category: skill.category
    };
    
    console.log('Datos a enviar:', skillToCreate);
    
    const response = await fetch(`${API_URL}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skillToCreate),
    });
    
    if (!response.ok) {
      throw new Error('Error creando skill');
    }
    
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    return data;
  } catch (error) {
    console.error('Error creating skill:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Actualiza una habilidad existente
 */
export const updateSkill = async (id: string, skill: any) => {
  try {
    console.log(`Intentando actualizar skill con ID: ${id}`, skill);

    // Crear un objeto con solo los campos que el modelo espera
    const skillToUpdate = {
      name: skill.name,
      icon: skill.icon,
      colored: skill.colored !== undefined ? skill.colored : false,
      category: skill.category
    };
    
    console.log('Datos a enviar:', skillToUpdate);
    
    const response = await fetch(`${API_URL}/skills/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skillToUpdate),
    });
    
    console.log(`Respuesta del servidor:`, response);
    
    if (!response.ok) {
      console.error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
      throw new Error('Error actualizando skill');
    }
    
    const data = await response.json();
    console.log(`Datos de respuesta:`, data);
    return data;
  } catch (error) {
    console.error('Error detallado al actualizar skill:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Elimina una habilidad
 */
export const deleteSkill = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/skills/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error eliminando skill');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting skill:', error);
    return { success: false, message: error.message };
  }
};

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
    console.log('Intentando crear habilidad adicional:', skill);
    
    // Crear un objeto con solo los campos que el modelo espera
    // No incluimos _id para que MongoDB genere uno automáticamente
    const skillToCreate = {
      name: skill.name
    };
    
    console.log('Datos a enviar:', skillToCreate);
    
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
    console.log('Respuesta del servidor:', data);
    return data;
  } catch (error) {
    console.error('Error creating other skill:', error);
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
  }
};
