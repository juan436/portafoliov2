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
  console.log("ContentContext updateServices - inicio", { services });
  
  // Primero actualizamos el estado global inmediatamente para evitar parpadeos
  setContent((prev) => ({ ...prev, services }))
  
  // Luego hacemos la operación asíncrona
  setIsLoading(true)
  try {
    const response = await updateContent('services', services)
    if (!response.success) {
      console.error("Error en la respuesta al actualizar services:", response)
      // En caso de error, podríamos revertir al estado anterior
    }
  } catch (error) {
    console.error("Error actualizando services:", error)
    // En caso de error, podríamos revertir al estado anterior
  }
  console.log("ContentContext updateServices - fin", { services, isLoading: false });
  setIsLoading(false)
}
