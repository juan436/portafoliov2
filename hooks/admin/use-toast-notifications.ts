import { useToast } from "@/hooks/use-toast";

/**
 * Hook para centralizar las notificaciones toast reutilizables
 * @returns Funciones para mostrar diferentes tipos de notificaciones toast
 */
export function useToastNotifications() {
  const { toast } = useToast();
  
  /**
   * Muestra una notificación toast de éxito
   */
  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };
  
  /**
   * Muestra una notificación toast de error
   */
  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };
  
  // Mensajes predefinidos para operaciones comunes
  
  /**
   * Muestra una notificación de creación exitosa
   */
  const showCreatedToast = (itemName: string) => {
    showSuccessToast(`${itemName} creado`, `El ${itemName.toLowerCase()} ha sido creado correctamente.`);
  };
  
  /**
   * Muestra una notificación de actualización exitosa
   */
  const showUpdatedToast = (itemName: string) => {
    showSuccessToast(`${itemName} actualizado`, `El ${itemName.toLowerCase()} ha sido actualizado correctamente.`);
  };
  
  /**
   * Muestra una notificación de eliminación exitosa
   */
  const showDeletedToast = (itemName: string) => {
    showSuccessToast(`${itemName} eliminado`, `El ${itemName.toLowerCase()} ha sido eliminado correctamente.`);
  };
  
  /**
   * Muestra una notificación de error en la creación
   */
  const showErrorCreatingToast = (itemName: string) => {
    showErrorToast("Error", `No se pudo crear el ${itemName.toLowerCase()}. Intenta de nuevo.`);
  };
  
  /**
   * Muestra una notificación de error en la actualización
   */
  const showErrorUpdatingToast = (itemName: string) => {
    showErrorToast("Error", `No se pudo actualizar el ${itemName.toLowerCase()}. Intenta de nuevo.`);
  };
  
  /**
   * Muestra una notificación de error en la eliminación
   */
  const showErrorDeletingToast = (itemName: string) => {
    showErrorToast("Error", `No se pudo eliminar el ${itemName.toLowerCase()}. Intenta de nuevo.`);
  };
  
  return {
    showSuccessToast,
    showErrorToast,
    showCreatedToast,
    showUpdatedToast,
    showDeletedToast,
    showErrorCreatingToast,
    showErrorUpdatingToast,
    showErrorDeletingToast
  };
}
