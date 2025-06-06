import { useState, useEffect, useCallback } from "react";
import { useContent } from "@/contexts/content-context";
import { useToastNotifications } from "../../use-toast-notifications";
import { HeroContent } from "@/components/admin/forms/hero-form";
import { AboutContent } from "@/components/admin/forms/about-form";
import { Service } from "@/components/admin/forms/services-form";
import { ContactContent } from "@/components/admin/forms/contact-form";

/**
 * Hook personalizado para gestionar el estado y la lógica del editor de contenido
 * Encapsula toda la lógica de gestión de contenido para las secciones Hero, About, Services y Contact
 */
export function useContentEditor() {
  const { 
    content, 
    updateHero, 
    updateAbout, 
    updateServices, 
    updateContact, 
    saveAllContent 
  } = useContent();
  
  const { showSuccessToast, showErrorToast } = useToastNotifications();
  const [activeTab, setActiveTab] = useState("hero");
  const [isLoading, setIsLoading] = useState(false);

  // Estados locales para edición
  const [heroContent, setHeroContent] = useState<HeroContent>({
    ...content.hero,
    profileImage:
      content.hero.profileImage ||
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  });
  
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    paragraph1: content.about.paragraph1 || "",
    paragraph2: content.about.paragraph2 || "",
    paragraph3: content.about.paragraph3 || "",
  });
  
  const [servicesContent, setServicesContent] = useState<Service[]>(content.services || []);
  const [contactContent, setContactContent] = useState<ContactContent>(content.contact);

  // Actualizar estados locales cuando cambia el contenido global
  useEffect(() => {
    // Evitar actualizaciones innecesarias que causan parpadeo
    if (isLoading) return;

    setHeroContent({
      ...content.hero,
      profileImage:
        content.hero.profileImage ||
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
    });
    
    setAboutContent({
      paragraph1: content.about.paragraph1 || "",
      paragraph2: content.about.paragraph2 || "",
      paragraph3: content.about.paragraph3 || "",
    });
    
    setServicesContent(content.services || []);
    setContactContent(content.contact);
  }, [content, isLoading]);

  /**
   * Función para guardar todos los cambios en el contenido
   */
  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);

      // Primero actualizar el contexto global con los estados locales
      updateHero(heroContent);
      updateAbout(aboutContent);
      updateServices(servicesContent);
      updateContact(contactContent);

      // Luego guardar todo en localStorage y disparar el evento
      const success = saveAllContent();

      if (success) {
        showSuccessToast({
          title: "Cambios guardados",
          description: "El contenido ha sido actualizado correctamente.",
        });
      } else {
        showErrorToast({
          title: "Error al guardar",
          description: "Ha ocurrido un error al guardar los cambios.",
        });
      }
    } catch (error) {
      console.error("Error al guardar el contenido:", error);
      showErrorToast({
        title: "Error",
        description: "Ocurrió un error inesperado al guardar los cambios.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    heroContent, 
    aboutContent, 
    servicesContent, 
    contactContent, 
    updateHero, 
    updateAbout, 
    updateServices, 
    updateContact, 
    saveAllContent, 
    showSuccessToast, 
    showErrorToast
  ]);

  return {
    // Estados
    activeTab,
    isLoading,
    heroContent,
    aboutContent,
    servicesContent,
    contactContent,
    
    // Setters
    setActiveTab,
    setHeroContent,
    setAboutContent,
    setServicesContent,
    setContactContent,
    
    // Acciones
    handleSave
  };
}
