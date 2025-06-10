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
  console.log("ContentContext updateHero - inicio", { hero, isLoading: true });
  
  // Actualizar inmediatamente el estado local para evitar el parpadeo
  setContent(prev => ({ ...prev, hero: { ...hero } }));
  
  // Luego actualizar en el servidor
  setIsLoading(true)
  try {
    const response = await updateContent('hero', hero)
    console.log("ContentContext updateHero - respuesta API", { response });
    // No es necesario actualizar el estado de nuevo aquí, ya lo hicimos arriba
  } catch (error) {
    console.error("Error actualizando hero:", error)
    // En caso de error, podríamos revertir al estado anterior
  }
  console.log("ContentContext updateHero - fin", { hero, isLoading: false });
  setIsLoading(false)
}
