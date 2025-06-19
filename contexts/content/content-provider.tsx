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
  hero: { title: "", subtitle: "", description: "", profileImage: "", translations: {} },
  about: { paragraph1: "", paragraph2: "", paragraph3: "", translations: {} },
  services: [], 
  projects: { fullstack: [], backend: [] },
  skills: { frontend: [], backend: [], database: [], devops: [] },
  otherSkills: [], 
  contact: { email: "", phone: "", location: "", translations: {} },
  experience: [] 
}

// Crear el proveedor
export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<Content>(emptyContent)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar todos los datos desde la API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Cargar contenido general
        const contentData = await fetchContent()
        console.log("Contenido original (hero translations):", contentData?.hero?.translations)
        console.log("Contenido original (about translations):", contentData?.about?.translations)

        // Cargar proyectos por categoría
        const fullstackProjects = await fetchProjects('fullstack')
        console.log("Proyectos fullstack (primer proyecto translations):", fullstackProjects[0]?.translations)
        const backendProjects = await fetchProjects('backend')

        // Cargar experiencias
        const experienceData = await fetchExperiences()
        console.log("Experiencias (primer experiencia translations):", experienceData[0]?.translations)

        // Cargar skills
        const skillsData = await fetchSkills()
        console.log("Skills frontend (primer skill translations):", skillsData?.frontend?.[0]?.translations)

        // Cargar otras habilidades
        const otherSkillsData = await fetchOtherSkills()
        console.log("Otras habilidades (primer skill translations):", otherSkillsData.data?.[0]?.translations)

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
              createdAt: p.createdAt,
              translations: p.translations || {} // Preservar traducciones
            })),
            backend: backendProjects.map((p: any) => ({
              id: p._id,
              title: p.title,
              description: p.description,
              image: p.image,
              tags: p.tags || [],
              github: p.github || "#",
              demo: p.demo || "#",
              createdAt: p.createdAt,
              translations: p.translations || {} // Preservar traducciones
            }))
          }

          // Asegurarse de preservar las traducciones en todas las entidades
          setContent({
            hero: {
              ...contentData.hero,
              translations: contentData.hero?.translations || {}
            } || emptyContent.hero,
            about: {
              ...contentData.about,
              translations: contentData.about?.translations || {}
            } || emptyContent.about,
            services: contentData.services?.map((service: any) => ({
              ...service,
              translations: service.translations || {}
            })) || [],
            projects: projectsData,
            skills: {
              frontend: skillsData?.frontend?.map((skill: any) => ({
                ...skill,
                translations: skill.translations || {}
              })) || [],
              backend: skillsData?.backend?.map((skill: any) => ({
                ...skill,
                translations: skill.translations || {}
              })) || [],
              database: skillsData?.database?.map((skill: any) => ({
                ...skill,
                translations: skill.translations || {}
              })) || [],
              devops: skillsData?.devops?.map((skill: any) => ({
                ...skill,
                translations: skill.translations || {}
              })) || []
            },
            otherSkills: otherSkillsData.data?.map((skill: any) => ({
              ...skill,
              translations: skill.translations || {}
            })) || [],
            contact: {
              ...contentData.contact,
              translations: contentData.contact?.translations || {}
            } || emptyContent.contact,
            experience: experienceData?.map((exp: any) => ({
              ...exp,
              translations: exp.translations || {}
            })) || []
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Función para guardar todo el contenido
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
    addOtherSkill: (skill) => addOtherSkill(skill, setContent, setIsLoading),
    editOtherSkill: (id, skill) => editOtherSkill(id, skill, setContent, setIsLoading),
    removeOtherSkill: (id) => removeOtherSkill(id, content, setContent, setIsLoading),
    
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

  // Verificar que las traducciones se preservaron correctamente en el estado
  console.log("ESTADO FINAL - Hero translations:", content.hero?.translations)
  console.log("ESTADO FINAL - About translations:", content.about?.translations)
  console.log("ESTADO FINAL - Primer servicio translations:", content.services?.[0]?.translations)
  console.log("ESTADO FINAL - Primer proyecto fullstack translations:", content.projects?.fullstack?.[0]?.translations)
  console.log("ESTADO FINAL - Primer skill frontend translations:", content.skills?.frontend?.[0]?.translations)
  console.log("ESTADO FINAL - Primer otherskill translations:", content.otherSkills?.[0]?.translations)
  console.log("ESTADO FINAL - Contact translations:", content.contact?.translations)
  console.log("ESTADO FINAL - Primer experiencia translations:", content.experience?.[0]?.translations)

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  )
}
