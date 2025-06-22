import { Dispatch, SetStateAction } from "react"
import { updateContent } from "@/services/api"
import { Content, About } from "../../types"

/**
 * Actualiza la sección About en el estado local y en el servidor
 * @param about Datos actualizados del About
 * @param setContent Función para actualizar el estado global
 * @param setIsLoading Función para actualizar el estado de carga
 */
export const updateAbout = async (
  about: About,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  // Actualizar inmediatamente el estado local para evitar el parpadeo
  setContent((prev) => ({ ...prev, about: { ...about } }));
  
  // Luego actualizar en el servidor
  setIsLoading(true)
  try {
    await updateContent('about', about)
  } catch (error) {
    console.error("Error actualizando about:", error)
  }
  setIsLoading(false)
}
