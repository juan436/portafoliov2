import { Dispatch, SetStateAction } from "react"
import { updateContent } from "@/services/api"
import { Content, Contact } from "../../types"

/**
 * Actualiza la sección Contact en el estado local y en el servidor
 * @param contact Datos actualizados del Contact
 * @param setContent Función para actualizar el estado global
 * @param setIsLoading Función para actualizar el estado de carga
 */
export const updateContact = async (
  contact: Contact,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  console.log("ContentContext updateContact - inicio", { contact, isLoading: true });
  
  // Actualizar inmediatamente el estado local para evitar el parpadeo
  setContent((prev) => ({ ...prev, contact: { ...contact } }));
  
  // Luego actualizar en el servidor
  setIsLoading(true)
  try {
    const response = await updateContent('contact', contact)
    console.log("ContentContext updateContact - respuesta API", { response });
    // No es necesario actualizar el estado de nuevo aquí, ya lo hicimos arriba
  } catch (error) {
    console.error("Error actualizando contact:", error)
    // En caso de error, podríamos revertir al estado anterior
  }
  console.log("ContentContext updateContact - fin", { contact, isLoading: false });
  setIsLoading(false)
}
