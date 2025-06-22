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
  setContent((prev) => ({ ...prev, contact: { ...contact } }));
  
  setIsLoading(true)
  try {
    await updateContent('contact', contact)
  } catch (error) {
    console.error("Error actualizando contact:", error)
  }
  setIsLoading(false)
}
