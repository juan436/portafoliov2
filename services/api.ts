// portfolio/services/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Proyectos
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

// Contenido
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

export const fetchOtherSkills = async () => {
  const response = await fetch('/api/other-skills');
  return await response.json();
};

export const createOtherSkill = async (skill: any) => {
  try {
    const response = await fetch(`${API_URL}/other-skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    
    if (!response.ok) {
      throw new Error('Error creando habilidad adicional');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating other skill:', error);
    return { success: false, message: error.message };
  }
};

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

export const createSkill = async (skill: any) => {
  try {
    const response = await fetch(`${API_URL}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    
    if (!response.ok) {
      throw new Error('Error creando skill');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating skill:', error);
    return { success: false, message: error.message };
  }
};

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