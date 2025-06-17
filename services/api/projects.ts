// portfolio/services/api/projects.ts
import { API_URL } from './index';

/**
 * Obtiene los proyectos, opcionalmente filtrados por categoría
 */
export const fetchProjects = async (category?: string) => {
  try {
    const url = category 
      ? `${API_URL}/projects?category=${category}` 
      : `${API_URL}/projects`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Error al obtener proyectos');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

/**
 * Crea un nuevo proyecto
 */
export const createProject = async (project: any) => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    
    if (!response.ok) {
      throw new Error('Error creando proyecto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Actualiza un proyecto existente
 */
export const updateProject = async (id: string, project: any) => {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    
    if (!response.ok) {
      throw new Error('Error actualizando proyecto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Elimina un proyecto
 */
export const deleteProject = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error eliminando proyecto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, message: error.message };
  }
};
