// portfolio/services/api/projects.ts
import { API_URL } from './index';
import { translateAndAddToObject } from '../client/translation';

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
 * Crea un nuevo proyecto con traducciones automáticas
 */
export const createProject = async (project: any) => {
  try {
    const fieldsToTranslate = ['title', 'description'];
    const projectWithTranslations = await translateAndAddToObject(
      project,
      'es',
      ['en', 'fr', 'it'],
      fieldsToTranslate
    );
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectWithTranslations),
    });
    
    if (!response.ok) {
      throw new Error('Error creando proyecto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

/**
 * Actualiza un proyecto existente con traducciones automáticas
 * Solo traduce los campos que realmente han sido modificados
 */
export const updateProject = async (id: string, project: any) => {
  try {
    console.log('API - Actualizando proyecto con ID:', id);
    console.log('API - Datos recibidos:', project);
    
    // 1. Verificar qué campos modificados necesitan traducción
    const fieldsRequiringTranslation = ['title', 'description'];
    const fieldsToTranslate = Object.keys(project).filter(field => 
      fieldsRequiringTranslation.includes(field)
    );
    
    console.log('API - Campos que requieren traducción:', fieldsRequiringTranslation);
    console.log('API - Campos presentes que serán traducidos:', fieldsToTranslate);
    
    // 2. Si no hay campos que requieran traducción, actualizar sin traducir
    if (fieldsToTranslate.length === 0) {
      console.log('API - No hay campos a traducir, actualizando sin traducciones');
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
    }
    
    // 3. Solo traducir los campos que están en la actualización y requieren traducción
    console.log('API - Campos a traducir:', fieldsToTranslate);
    const projectWithTranslations = await translateAndAddToObject(
      project,
      'es',
      ['en', 'fr', 'it'],
      fieldsToTranslate
    );
    
    console.log('API - Proyecto con traducciones:', projectWithTranslations);
    
    // 4. Enviar al backend el objeto con traducciones
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectWithTranslations),
    });
    
    if (!response.ok) {
      throw new Error('Error actualizando proyecto');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
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
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};
