import { useState, useEffect, useCallback } from "react";
import { useContent } from "@/contexts/content-context";
import { useToastNotifications } from "../../use-toast-notifications";
import type { Skill } from "@/contexts/content-context";

/**
 * Hook para gestionar las habilidades en el panel de administración
 * Encapsula toda la lógica de gestión de habilidades
 * @returns Funciones y estado para gestionar habilidades
 */
export function useSkillsActions() {
  const { 
    content, 
    createSkillItem,
    updateSkillItem,
    deleteSkillItem
  } = useContent();
  const toastNotifications = useToastNotifications();
  
  // Estado local para las habilidades
  const [skills, setSkills] = useState<Skill[]>(content.skills || []);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("frontend");

  // Sincronizar con el contexto global
  useEffect(() => {
    if (content.skills) {
      setSkills(content.skills);
    }
  }, [content.skills]);

  /**
   * Filtra las habilidades por categoría
   */
  const getSkillsByCategory = useCallback((category: string) => {
    return skills.filter(skill => skill.category === category);
  }, [skills]);

  /**
   * Abre el formulario para crear una nueva habilidad
   */
  const openNewSkillForm = useCallback((category: string) => {
    setCurrentSkill({
      name: "",
      icon: "",
      level: 50,
      category
    });
    setIsSkillFormOpen(true);
  }, []);

  /**
   * Abre el formulario para editar una habilidad existente
   */
  const openEditSkillForm = useCallback((skill: Skill) => {
    setCurrentSkill(skill);
    setIsSkillFormOpen(true);
  }, []);

  /**
   * Cierra el formulario de habilidades
   */
  const closeSkillForm = useCallback(() => {
    setIsSkillFormOpen(false);
    setCurrentSkill(null);
  }, []);

  /**
   * Guarda una habilidad (nueva o editada)
   */
  const saveSkill = useCallback((skill: Skill) => {
    if (skill._id) {
      // Actualizar habilidad existente
      updateSkillItem(skill)
        .then(() => {
          toastNotifications.showSuccessToast(
            "Habilidad actualizada", 
            `La habilidad "${skill.name}" ha sido actualizada correctamente.`
          );
          setSkills(prevSkills => 
            prevSkills.map(s => s._id === skill._id ? skill : s)
          );
        })
        .catch(error => {
          toastNotifications.showErrorToast(
            "Error al actualizar", 
            `No se pudo actualizar la habilidad: ${error.message}`
          );
        });
    } else {
      // Crear nueva habilidad
      createSkillItem(skill)
        .then(newSkill => {
          toastNotifications.showSuccessToast(
            "Habilidad creada", 
            `La habilidad "${newSkill.name}" ha sido creada correctamente.`
          );
          setSkills(prevSkills => [...prevSkills, newSkill]);
        })
        .catch(error => {
          toastNotifications.showErrorToast(
            "Error al crear", 
            `No se pudo crear la habilidad: ${error.message}`
          );
        });
    }
    
    closeSkillForm();
  }, [updateSkillItem, createSkillItem, closeSkillForm, toastNotifications]);

  /**
   * Elimina una habilidad
   */
  const deleteSkill = useCallback((skillId: string) => {
    deleteSkillItem(skillId)
      .then(() => {
        toastNotifications.showSuccessToast(
          "Habilidad eliminada", 
          "La habilidad ha sido eliminada correctamente."
        );
        setSkills(prevSkills => prevSkills.filter(skill => skill._id !== skillId));
      })
      .catch(error => {
        toastNotifications.showErrorToast(
          "Error al eliminar", 
          `No se pudo eliminar la habilidad: ${error.message}`
        );
      });
  }, [deleteSkillItem, toastNotifications]);

  return {
    skills,
    currentSkill,
    isSkillFormOpen,
    activeTab,
    getSkillsByCategory,
    setActiveTab,
    openNewSkillForm,
    openEditSkillForm,
    closeSkillForm,
    saveSkill,
    deleteSkill
  };
}
