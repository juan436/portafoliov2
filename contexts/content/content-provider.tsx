"use client"

import { useState, useEffect, type ReactNode } from "react"
import ContentContext, { ContentContextType } from "./content-context"
import { Content, OtherSkill, Project, Skill, Experience } from "./types"

// Importar servicios API para carga inicial de datos
import {
  fetchContent, fetchProjects, fetchExperiences, fetchSkills, fetchOtherSkills
} from "@/services/api"

// Importar acciones de cada slice
import { updateHero } from "./slices/hero/actions"
import { updateAbout } from "./slices/about/actions"
import { updateServices } from "./slices/services/actions"
import { 
  updateProjects, 
  createProjectItem as createProject, 
  updateProjectItem as updateProject, 
  deleteProjectItem as deleteProject 
} from "./slices/projects/actions"
import { 
  updateSkills, 
  createSkillItem as createSkill, 
  updateSkillItem as updateSkill, 
  deleteSkillItem as deleteSkill 
} from "./slices/skills/actions"
import { 
  updateOtherSkills, 
  addOtherSkill, 
  editOtherSkill, 
  removeOtherSkill 
} from "./slices/otherSkills/actions"
import { updateContact } from "./slices/contact/actions"
import { 
  updateExperience, 
  createExperienceItem as createExperience, 
  updateExperienceItem as updateExperienceItem, 
  deleteExperienceItem as deleteExperienceItem 
} from "./slices/experience/actions"

// Crear estructura mínima para evitar errores durante la carga
const emptyContent: Content = {
  hero: { title: "", subtitle: "", description: "", profileImage: "" },
  about: { paragraph1: "", paragraph2: "", paragraph3: "" },
  services: [],
  projects: { fullstack: [], backend: [] },
  skills: { frontend: [], backend: [], database: [], devops: [] },
  otherSkills: [],
  contact: { email: "", phone: "", location: "" },
  experience: []
}

// Crear el proveedor
export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<Content>(emptyContent)
  const [isLoading, setIsLoading] = useState(true)
  const [otherSkills, setOtherSkills] = useState<OtherSkill[]>([])

  // Cargar todos los datos desde la API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Cargar contenido general
        const contentData = await fetchContent()

        // Cargar proyectos por categoría
        const fullstackProjects = await fetchProjects('fullstack')
        const backendProjects = await fetchProjects('backend')

        // Cargar experiencias
        const experienceData = await fetchExperiences()

        // Cargar skills
        const skillsData = await fetchSkills()

        // Cargar otras habilidades
        const otherSkillsData = await fetchOtherSkills()
        console.log("Datos de otras habilidades:", otherSkillsData.data)

        // Construir modelo de datos completo desde las APIs
        if (contentData) {
          const projectsData = {
            fullstack: fullstackProjects.map((p: any) => ({
              id: p._id,
              title: p.title,
              description: p.description,
              image: p.image,
              tags: p.tags || [],
              github: p.github || "#",
              demo: p.demo || "#",
              createdAt: p.createdAt
            })),
            backend: backendProjects.map((p: any) => ({
              id: p._id,
              title: p.title,
              description: p.description,
              image: p.image,
              tags: p.tags || [],
              github: p.github || "#",
              demo: p.demo || "#",
              createdAt: p.createdAt
            }))
          }

          setContent({
            hero: contentData.hero || emptyContent.hero,
            about: contentData.about || emptyContent.about,
            services: contentData.services || [],
            projects: projectsData,
            skills: skillsData || emptyContent.skills,
            otherSkills: otherSkillsData.data || [],
            contact: contentData.contact || emptyContent.contact,
            experience: experienceData || []
          })
        }
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Cargar habilidades al iniciar
  useEffect(() => {
    const loadOtherSkills = async () => {
      const response = await fetchOtherSkills()
      if (response.success) {
        setOtherSkills(response.data)
      }
    }
    loadOtherSkills()
  }, [])

  // Función para guardar todo el contenido - Ya no usa localStorage
  const saveAllContent = (): boolean => {
    try {
      // Disparar un evento para notificar a otros componentes sobre la actualización
      if (typeof window !== "undefined") {
        const event = new CustomEvent("contentUpdated", { detail: content })
        window.dispatchEvent(event)
      }
      return true
    } catch (error) {
      console.error("Error dispatching content update event:", error)
      return false
    }
  }

  // Crear el objeto de contexto con todas las acciones
  const contextValue: ContentContextType = {
    content,
    isLoading,
    // Métodos para secciones principales
    updateHero: (hero) => updateHero(hero, setContent, setIsLoading),
    updateAbout: (about) => updateAbout(about, setContent, setIsLoading),
    updateServices: (services) => updateServices(services, setContent, setIsLoading),
    updateProjects: (projects) => updateProjects(projects, setContent, setIsLoading),
    updateSkills: (skills) => updateSkills(skills, setContent, setIsLoading),
    updateOtherSkills: (otherSkills) => updateOtherSkills(otherSkills, setContent, setIsLoading),
    updateContact: (contact) => updateContact(contact, setContent, setIsLoading),
    updateExperience: (experience) => updateExperience(experience, setContent, setIsLoading),
    saveAllContent,
    
    // OtherSkills
    otherSkills,
    addOtherSkill: (skill) => addOtherSkill(skill, setContent, setOtherSkills),
    editOtherSkill: (id, skill) => editOtherSkill(id, skill, setContent, setOtherSkills),
    removeOtherSkill: (id) => removeOtherSkill(id, setContent, setOtherSkills),
    
    // Proyectos
    createProjectItem: (project, category) => createProject(project, category, setContent, setIsLoading),
    updateProjectItem: (id, project, category) => updateProject(id, project, category, content, setContent, setIsLoading),
    deleteProjectItem: (id, category) => deleteProject(id, category, content, setContent, setIsLoading),
    
    // Skills
    createSkillItem: (skill) => createSkill(skill, setContent, setIsLoading),
    updateSkillItem: (id, skill) => updateSkill(id, skill, setContent, setIsLoading),
    deleteSkillItem: (id) => deleteSkill(id, content, setContent, setIsLoading),
    
    // Experience
    createExperienceItem: (experience) => createExperience(experience, setContent, setIsLoading),
    updateExperienceItem: (id, experience) => updateExperienceItem(id, experience, setContent, setIsLoading),
    deleteExperienceItem: (id) => deleteExperienceItem(id, setContent, setIsLoading)
  }

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  )
}
