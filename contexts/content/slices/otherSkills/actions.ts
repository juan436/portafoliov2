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
  }
  setIsLoading(false)
}

/**
 * Añade una nueva habilidad adicional
 */
export const addOtherSkill = async (
  skill: OtherSkill,
  setContent: Dispatch<SetStateAction<Content>>,
  setOtherSkills: Dispatch<SetStateAction<OtherSkill[]>>
) => {
  try {
    const response = await createOtherSkillApi(skill)
    if (response.success) {
      setOtherSkills(prev => [...prev, response.data])

      // Actualizar también el contenido global
      setContent(prev => ({
        ...prev,
        otherSkills: [...prev.otherSkills, response.data]
      }))
    }
  } catch (error) {
    console.error("Error añadiendo habilidad:", error)
  }
}

/**
 * Edita una habilidad adicional existente
 */
export const editOtherSkill = async (
  id: string, 
  updatedSkill: OtherSkill,
  setContent: Dispatch<SetStateAction<Content>>,
  setOtherSkills: Dispatch<SetStateAction<OtherSkill[]>>
) => {
  try {
    const response = await updateOtherSkillApi(id, updatedSkill)
    if (response.success) {
      // Actualizar el estado local de otherSkills con los datos devueltos por el servidor
      setOtherSkills(prev =>
        prev.map(skill => skill._id === id ? response.data : skill)
      )

      // Actualizar también el contenido global
      setContent(prev => ({
        ...prev,
        otherSkills: prev.otherSkills.map(
          skill => skill._id === id ? response.data : skill
        )
      }))
      
      return response
    }
    return response
  } catch (error) {
    console.error("Error editando habilidad:", error)
    return { success: false, message: error.message }
  }
}

/**
 * Elimina una habilidad adicional existente
 */
export const removeOtherSkill = async (
  id: string,
  setContent: Dispatch<SetStateAction<Content>>,
  setOtherSkills: Dispatch<SetStateAction<OtherSkill[]>>
): Promise<boolean> => {
  try {
    const response = await deleteOtherSkillApi(id)
    if (response.success) {
      // Actualizar el estado local de otherSkills
      setOtherSkills(prev => prev.filter(skill => skill._id !== id))

      // Actualizar también el contenido global
      setContent(prev => ({
        ...prev,
        otherSkills: prev.otherSkills.filter(skill => skill._id !== id)
      }))
      
      // Devolver true para indicar éxito
      return true
    } else {
      // Si la API devuelve un error, devolver false
      return false
    }
  } catch (error) {
    console.error("Error eliminando habilidad:", error)
    return false
  }
}
