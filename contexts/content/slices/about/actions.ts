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
  console.log("ContentContext updateAbout - inicio", { about, isLoading: true });
  
  // Actualizar inmediatamente el estado local para evitar el parpadeo
  setContent((prev) => ({ ...prev, about: { ...about } }));
  
  // Luego actualizar en el servidor
  setIsLoading(true)
  try {
    const response = await updateContent('about', about)
    console.log("ContentContext updateAbout - respuesta API", { response });
    // No es necesario actualizar el estado de nuevo aquí, ya lo hicimos arriba
  } catch (error) {
    console.error("Error actualizando about:", error)
    // En caso de error, podríamos revertir al estado anterior
  }
  console.log("ContentContext updateAbout - fin", { about, isLoading: false });
  setIsLoading(false)
}
