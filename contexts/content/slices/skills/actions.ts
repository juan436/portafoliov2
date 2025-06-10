import { Dispatch, SetStateAction } from "react"
import { 
  updateContent,
  createSkill as createSkillApi,
  updateSkill as updateSkillApi,
  deleteSkill as deleteSkillApi
} from "@/services/api"
import { Content, Skill, Skills } from "../../types"

/**
 * Actualiza la sección Skills en el estado local y en el servidor
 */
export const updateSkills = async (
  skills: Skills,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  setIsLoading(true)
  try {
    const response = await updateContent('skills', skills)
    if (response.success) {
      setContent((prev) => ({ ...prev, skills }))
    }
  } catch (error) {
    console.error("Error actualizando skills:", error)
  }
  setIsLoading(false)
}

/**
 * Crea una nueva habilidad técnica
 */
export const createSkillItem = async (
  skillData: Omit<Skill, "_id">,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<Skill | null> => {
  setIsLoading(true)
  try {
    // Llamar a la API para crear la skill
    const response = await createSkillApi(skillData)

    if (response.success && response.data) {
      // Formatear la skill creada
      const newSkill: Skill = {
        _id: response.data._id,
        name: response.data.name,
        icon: response.data.icon,
        category: response.data.category,
        colored: response.data.colored
      }

      console.log("Skill creada:", newSkill);

      // Actualizar el estado local según la categoría
      setContent(prev => {
        const updatedSkills = { ...prev.skills };

        // Añadir la nueva skill a la categoría correspondiente
        if (newSkill.category === 'frontend') {
          updatedSkills.frontend = [...updatedSkills.frontend, newSkill];
        } else if (newSkill.category === 'backend') {
          updatedSkills.backend = [...updatedSkills.backend, newSkill];
        } else if (newSkill.category === 'database') {
          updatedSkills.database = [...updatedSkills.database, newSkill];
        } else if (newSkill.category === 'devops') {
          updatedSkills.devops = [...updatedSkills.devops, newSkill];
        }

        return {
          ...prev,
          skills: updatedSkills
        };
      });

      setIsLoading(false)
      return newSkill
    }

    setIsLoading(false)
    return null
  } catch (error) {
    console.error("Error creando skill:", error)
    setIsLoading(false)
    return null
  }
}

/**
 * Actualiza una habilidad técnica existente
 */
export const updateSkillItem = async (
  id: string, 
  skill: Skill,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<boolean> => {
  setIsLoading(true)
  try {
    // Asegurarnos que estamos pasando el objeto correcto a la API
    // No necesitamos hacer ajustes al objeto skill, ya que ya contiene la categoría
    const response = await updateSkillApi(id, skill)

    if (response.success) {
      // Actualizar el estado local según la categoría
      setContent(prev => {
        const updatedSkills = { ...prev.skills };
        const category = skill.category;

        // Actualizar la skill en la categoría correspondiente
        if (category === 'frontend') {
          updatedSkills.frontend = updatedSkills.frontend.map(s => {
            const skillId = s._id || s.id;
            return (skillId?.toString() || '') === id ? skill : s;
          });
        } else if (category === 'backend') {
          updatedSkills.backend = updatedSkills.backend.map(s => {
            const skillId = s._id || s.id;
            return (skillId?.toString() || '') === id ? skill : s;
          });
        } else if (category === 'database') {
          updatedSkills.database = updatedSkills.database.map(s => {
            const skillId = s._id || s.id;
            return (skillId?.toString() || '') === id ? skill : s;
          });
        } else if (category === 'devops') {
          updatedSkills.devops = updatedSkills.devops.map(s => {
            const skillId = s._id || s.id;
            return (skillId?.toString() || '') === id ? skill : s;
          });
        }

        return {
          ...prev,
          skills: updatedSkills
        };
      });

      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  } catch (error) {
    console.error("Error actualizando skill:", error)
    setIsLoading(false)
    return false
  }
}

/**
 * Elimina una habilidad técnica existente
 */
export const deleteSkillItem = async (
  id: string,
  content: Content,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<boolean> => {
  // Verificar que el ID sea válido
  if (!id) {
    console.error('Se intentó eliminar una skill con ID undefined');
    return false;
  }

  setIsLoading(true)
  try {
    // Primero necesitamos encontrar la skill para saber su categoría
    let skillCategory = '';
    let skillFound = false;

    // Buscar en todas las categorías
    for (const category of ['frontend', 'backend', 'database', 'devops'] as const) {
      // Buscar por _id
      const found = content.skills[category].find(s => s._id === id);
      if (found) {
        skillCategory = category;
        skillFound = true;
        break;
      }
    }

    if (!skillFound) {
      console.error(`No se encontró la skill con ID ${id} en ninguna categoría`);
      setIsLoading(false);
      return false;
    }

    // Llamar a la API para eliminar la skill
    const response = await deleteSkillApi(id);

    if (response.success) {
      // Actualizar el estado local
      setContent(prev => {
        const updatedSkills = { ...prev.skills };

        // Eliminar la skill de la categoría correspondiente
        if (skillCategory === 'frontend') {
          updatedSkills.frontend = updatedSkills.frontend.filter(s => s._id !== id);
        } else if (skillCategory === 'backend') {
          updatedSkills.backend = updatedSkills.backend.filter(s => s._id !== id);
        } else if (skillCategory === 'database') {
          updatedSkills.database = updatedSkills.database.filter(s => s._id !== id);
        } else if (skillCategory === 'devops') {
          updatedSkills.devops = updatedSkills.devops.filter(s => s._id !== id);
        }

        return {
          ...prev,
          skills: updatedSkills
        };
      });

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  } catch (error) {
    console.error("Error eliminando skill:", error);
    setIsLoading(false);
    return false;
  }
}
