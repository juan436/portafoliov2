import { Dispatch, SetStateAction } from "react"
import { 
  updateContent,
  createOtherSkill as createOtherSkillApi,
  updateOtherSkill as updateOtherSkillApi,
  deleteOtherSkill as deleteOtherSkillApi
} from "@/services/api"
import { Content, OtherSkill } from "../../types"

/**
 * Actualiza la sección OtherSkills en el estado local y en el servidor
 */
export const updateOtherSkills = async (
  otherSkills: OtherSkill[],
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  setIsLoading(true)
  try {
    const response = await updateContent('otherSkills', otherSkills)
    if (response.success) {
      setContent((prev) => ({ ...prev, otherSkills }))
    }
  } catch (error) {
    console.error("Error actualizando otherSkills:", error)
  } finally {
    setIsLoading(false)
  }
}

/**
 * Añade una nueva habilidad adicional
 */
export const addOtherSkill = async (
  skill: OtherSkill,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<OtherSkill | null> => {
  setIsLoading(true)
  try {
    const response = await createOtherSkillApi(skill)
    if (response.success) {
      // Actualizar el contenido global
      setContent(prev => ({
        ...prev,
        otherSkills: [...prev.otherSkills, response.data]
      }))
      
      setIsLoading(false)
      return response.data
    }
    
    setIsLoading(false)
    return null
  } catch (error) {
    console.error("Error añadiendo habilidad:", error)
    setIsLoading(false)
    return null
  }
}

/**
 * Edita una habilidad adicional existente
 */
export const editOtherSkill = async (
  id: string, 
  updatedSkill: OtherSkill,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<boolean> => {
  setIsLoading(true)
  try {
    const response = await updateOtherSkillApi(id, updatedSkill)
    if (response.success) {
      // Actualizar el contenido global
      setContent(prev => ({
        ...prev,
        otherSkills: prev.otherSkills.map(
          skill => skill._id === id ? response.data : skill
        )
      }))
      
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  } catch (error) {
    console.error("Error editando habilidad:", error)
    setIsLoading(false)
    return false
  }
}

/**
 * Elimina una habilidad adicional existente
 */
export const removeOtherSkill = async (
  id: string,
  content: Content,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<boolean> => {
  setIsLoading(true)
  try {
    const response = await deleteOtherSkillApi(id)
    if (response.success) {
      // Actualizar el contenido global
      setContent(prev => ({
        ...prev,
        otherSkills: prev.otherSkills.filter(skill => skill._id !== id)
      }))
      
      setIsLoading(false)
      return true
    } else {
      setIsLoading(false)
      return false
    }
  } catch (error) {
    console.error("Error eliminando habilidad:", error)
    setIsLoading(false)
    return false
  }
}
