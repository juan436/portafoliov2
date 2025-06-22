import { Dispatch, SetStateAction } from "react"
import { updateContent } from "@/services/api"
import { Content, Service } from "../../types"

/**
 * Actualiza la sección Services en el estado local y en el servidor
 * @param services Datos actualizados de Services
 * @param setContent Función para actualizar el estado global
 * @param setIsLoading Función para actualizar el estado de carga
 */
export const updateServices = async (
  services: Service[],
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  setContent((prev) => ({ ...prev, services }))
  
  setIsLoading(true)
  try {
    await updateContent('services', services)
  } catch (error) {
    console.error("Error actualizando services:", error)
  }
  setIsLoading(false)
}
