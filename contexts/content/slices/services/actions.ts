import { Dispatch, SetStateAction } from "react"
import { updateContent, deleteService as apiDeleteService } from "@/services/api"
import { Content, Service } from "../../types"

/**
 * Actualiza la sección Services en el estado local y en el servidor
 * @param services Lista de servicios actualizada
 * @param setContent Función para actualizar el estado global
 * @param setIsLoading Función para actualizar el estado de carga
 */
export const updateServices = async (
  services: Array<Service & { _modifiedFields?: string[] }>,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  console.log("Services - Datos completos recibidos:", services);
  
  // Procesar cada servicio para extraer _modifiedFields y crear objetos con solo campos modificados
  const processedServices = services.map((service, index) => {
    // Extraer _modifiedFields si existe
    const modifiedFields = service._modifiedFields || [];
    console.log(`Services - Item ${index} - Campos modificados:`, modifiedFields);
    
    // Crear una copia sin _modifiedFields para el estado local
    const { _modifiedFields, ...serviceForState } = service;
    
    // Verificar si es un servicio nuevo (sin _id)
    const isNewService = !serviceForState._id;
    
    // Si es un servicio nuevo, enviarlo completo
    if (isNewService) {
      console.log(`Services - Item ${index} - Es un servicio NUEVO, enviando completo:`, serviceForState);
      return { serviceForState, fieldsToUpdate: serviceForState, hasChanges: true };
    }
    
    // Si hay campos modificados, crear un objeto con solo esos campos
    if (modifiedFields.length > 0) {
      const fieldsToUpdate: Record<string, any> = {};
      
      // Siempre incluir el ID para identificar el servicio
      if ('_id' in serviceForState) {
        fieldsToUpdate._id = serviceForState._id;
      }
      
      // Añadir solo los campos modificados
      modifiedFields.forEach(field => {
        fieldsToUpdate[field] = serviceForState[field as keyof typeof serviceForState];
      });
      
      console.log(`Services - Item ${index} - Enviando solo estos campos:`, fieldsToUpdate);
      return { serviceForState, fieldsToUpdate, hasChanges: true };
    }
    
    // Si no hay campos modificados, no incluir en la actualización
    console.log(`Services - Item ${index} - No hay campos modificados, no se enviará al API`);
    return { serviceForState, fieldsToUpdate: null, hasChanges: false };
  });
  
  // Actualizar el estado local sin incluir _modifiedFields
  setContent(prev => ({ 
    ...prev, 
    services: processedServices.map(item => item.serviceForState) 
  }));
  
  // Filtrar solo los servicios que tienen cambios
  const servicesWithChanges = processedServices
    .filter(item => item.hasChanges)
    .map(item => item.fieldsToUpdate);
  
  // Si no hay servicios con cambios, no hacer nada más
  if (servicesWithChanges.length === 0) {
    console.log("Services - No hay servicios con campos modificados, no se envía nada al API");
    return;
  }
  
  setIsLoading(true);
  try {
    // Enviar solo los campos modificados de cada servicio al API
    console.log("Services - Enviando al API:", servicesWithChanges);
    const response = await updateContent('services', servicesWithChanges);
    
    // Si hay servicios nuevos, actualizar sus IDs desde la respuesta del servidor
    if (response && response.data && response.data.services) {
      console.log("Services - Respuesta del servidor con servicios:", response.data.services);
      console.log("Services - Estado actual de servicios antes de actualizar IDs:", 
        JSON.stringify(services.map(s => ({ id: s._id, title: s.title }))));
      
      // Actualizar el estado con los IDs de los servicios nuevos
      setContent(prev => {
        const updatedServices = [...prev.services];
        console.log("Services - Servicios en estado local:", 
          JSON.stringify(updatedServices.map(s => ({ id: s._id, title: s.title }))));
        
        // Encontrar servicios sin ID en el estado local
        const servicesWithoutId = updatedServices.filter(service => !service._id);
        console.log(`Services - Encontrados ${servicesWithoutId.length} servicios sin ID en el estado local`);
        
        // Si hay servicios nuevos en la respuesta, asignar IDs
        if (servicesWithoutId.length > 0 && response.data.services.length > 0) {
          // Para cada servicio sin ID, buscar su correspondiente en la respuesta
          let serverIndex = 0;
          for (let i = 0; i < updatedServices.length; i++) {
            if (!updatedServices[i]._id && serverIndex < response.data.services.length) {
              const newId = response.data.services[serverIndex]._id;
              console.log(`Services - Actualizando servicio en posición ${i} (${updatedServices[i].title}) con ID: ${newId}`);
              
              updatedServices[i] = {
                ...updatedServices[i],
                _id: newId
              };
              serverIndex++;
            }
          }
          
          console.log("Services - Estado final después de actualizar IDs:", 
            JSON.stringify(updatedServices.map(s => ({ id: s._id, title: s.title }))));
        }
        
        return {
          ...prev,
          services: updatedServices
        };
      });
    }
  } catch (error) {
    console.error("Error actualizando services:", error);
  }
  setIsLoading(false);
}

/**
 * Elimina un servicio específico por su ID
 * @param id ID del servicio a eliminar
 * @param content Estado actual del contenido
 * @param setContent Función para actualizar el estado global
 * @param setIsLoading Función para actualizar el estado de carga
 * @returns Booleano indicando si la operación fue exitosa
 */
export const deleteService = async (
  id: string,
  content: Content,
  setContent: Dispatch<SetStateAction<Content>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<boolean> => {
  console.log(`[deleteService/slice] Iniciando eliminación del servicio con ID: ${id}`);
  console.log(`[deleteService/slice] Estado actual de servicios:`, content.services);
  
  // Verificar que el ID sea válido
  if (!id || id.trim() === '') {
    console.error('[deleteService/slice] ID de servicio inválido');
    return false;
  }
  
  // Guardar una copia del estado actual para posible restauración
  const originalContent = { ...content };
  
  // Actualizar el estado local inmediatamente para mejor UX
  setContent(prev => {
    const updatedServices = prev.services.filter(service => service._id !== id);
    console.log(`[deleteService/slice] Servicios después de filtrar:`, updatedServices);
    return {
      ...prev,
      services: updatedServices
    };
  });
  
  console.log(`[deleteService/slice] Estableciendo isLoading a true`);
  setIsLoading(true);
  
  try {
    // Llamar a la API para eliminar el servicio
    console.log(`[deleteService/slice] Llamando a apiDeleteService con ID: ${id}`);
    const result = await apiDeleteService(id);
    console.log(`[deleteService/slice] Respuesta de apiDeleteService:`, result);
    
    if (!result.success) {
      // Si hay un error, revertir el cambio local
      console.error(`[deleteService/slice] Error eliminando servicio:`, result.message);
      console.log(`[deleteService/slice] Restaurando estado original`);
      setContent(prev => ({ ...originalContent })); // Restaurar el estado anterior
      return false;
    }
    
    console.log(`[deleteService/slice] Servicio eliminado con éxito`);
    return true;
  } catch (error) {
    console.error(`[deleteService/slice] Error:`, error);
    // Revertir el cambio local en caso de error
    console.log(`[deleteService/slice] Restaurando estado original debido al error`);
    setContent(prev => ({ ...originalContent }));
    return false;
  } finally {
    console.log(`[deleteService/slice] Estableciendo isLoading a false`);
    setIsLoading(false);
  }
};
