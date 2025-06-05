import { useState, useEffect, useCallback } from "react";
import { useContent } from "@/contexts/content-context";
import { useToastNotifications } from "../../use-toast-notifications";
import type { Service } from "@/components/admin/forms/services-form";

/**
 * Hook para gestionar los servicios en el panel de administración
 * Encapsula toda la lógica de gestión de servicios
 * @returns Funciones y estado para gestionar servicios
 */
export function useServicesActions() {
  const { 
    content, 
    updateContent
  } = useContent();
  const toastNotifications = useToastNotifications();
  
  // Estado local para los servicios
  const [servicesContent, setServicesContent] = useState<Service[]>(content.services || []);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isCreatingNewService, setIsCreatingNewService] = useState(false);

  // Sincronizar con el contexto global
  useEffect(() => {
    if (content.services) {
      setServicesContent(content.services);
    }
  }, [content.services]);

  /**
   * Maneja cambios en la lista de servicios
   */
  const handleServicesChange = useCallback((updatedServices: Service[]) => {
    setServicesContent(updatedServices);
    
    // Actualizar en el contexto global
    updateContent({
      ...content,
      services: updatedServices
    });
    
    toastNotifications.showSuccessToast("Servicios actualizados", "Los cambios han sido guardados correctamente.");
  }, [content, updateContent, toastNotifications]);

  /**
   * Añade un nuevo servicio
   */
  const addNewService = useCallback(() => {
    const newService: Service = {
      title: "",
      description: "",
      icon: "Code"
    };
    
    setSelectedService(newService);
    setEditMode(true);
    setIsCreatingNewService(true);
  }, []);

  /**
   * Maneja la selección de un servicio
   */
  const handleSelectService = useCallback((service: Service) => {
    setSelectedService(service);
    setEditMode(false);
    setIsCreatingNewService(false);
  }, []);

  /**
   * Guarda los cambios de un servicio
   */
  const handleSaveEdit = useCallback((updatedService: Service) => {
    let updatedServices: Service[];
    
    if (isCreatingNewService) {
      // Agregar nuevo servicio
      updatedServices = [...servicesContent, updatedService];
      toastNotifications.showSuccessToast("Servicio creado", "El nuevo servicio ha sido creado correctamente.");
    } else {
      // Actualizar servicio existente
      updatedServices = servicesContent.map(service => 
        service._id === updatedService._id ? updatedService : service
      );
      toastNotifications.showSuccessToast("Servicio actualizado", "Los cambios han sido guardados correctamente.");
    }
    
    setServicesContent(updatedServices);
    setSelectedService(updatedService);
    setEditMode(false);
    setIsCreatingNewService(false);
    
    // Actualizar en el contexto global
    updateContent({
      ...content,
      services: updatedServices
    });
  }, [content, servicesContent, isCreatingNewService, updateContent, toastNotifications]);

  /**
   * Cancela la edición de un servicio
   */
  const handleCancelEdit = useCallback(() => {
    if (isCreatingNewService) {
      setSelectedService(null);
    }
    setEditMode(false);
    setIsCreatingNewService(false);
  }, [isCreatingNewService]);

  /**
   * Elimina un servicio
   */
  const deleteService = useCallback((serviceId: string) => {
    const updatedServices = servicesContent.filter(service => service._id !== serviceId);
    
    setServicesContent(updatedServices);
    
    if (selectedService && selectedService._id === serviceId) {
      setSelectedService(updatedServices.length > 0 ? updatedServices[0] : null);
    }
    
    // Actualizar en el contexto global
    updateContent({
      ...content,
      services: updatedServices
    });
    
    toastNotifications.showSuccessToast("Servicio eliminado", "El servicio ha sido eliminado correctamente.");
  }, [content, servicesContent, selectedService, updateContent, toastNotifications]);

  return {
    servicesContent,
    selectedService,
    editMode,
    isCreatingNewService,
    setServicesContent,
    setSelectedService,
    setEditMode,
    addNewService,
    handleSelectService,
    handleSaveEdit,
    handleCancelEdit,
    deleteService
  };
}