import { Dispatch, SetStateAction } from "react"
import { updateContent } from "@/services/api"
import { Content, Hero } from "../../types"

/**
 * Actualiza la sección Hero en el estado local y en el servidor
 * @param hero Datos actualizados del Hero
 * @param setContent Función para actualizar el estado global
 * @param setIsLoading Función para actualizar el estado de carga
 */
export const updateHero = async (
  hero: Hero,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  setContent(prev => ({ ...prev, hero: { ...hero } }));
  
  setIsLoading(true)
  try {
    await updateContent('hero', hero)
  } catch (error) {
    console.error("Error actualizando hero:", error)
  }
  setIsLoading(false)
}
