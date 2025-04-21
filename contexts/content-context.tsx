"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import { fetchContent, fetchProjects, fetchExperiences, fetchSkills, fetchOtherSkills, createOtherSkill, updateOtherSkill, deleteOtherSkill, updateContent } from "@/services/api"

// Definir el tipo para el contexto de contenido
type ContentContextType = {
  content: Content
  isLoading: boolean
  updateHero: (hero: Hero) => void
  updateAbout: (about: About) => void
  updateServices: (services: Service[]) => void
  updateProjects: (projects: Projects) => void
  updateSkills: (skills: Skills) => void
  updateOtherSkills: (otherSkills: OtherSkill[]) => void
  updateContact: (contact: Contact) => void
  saveAllContent: () => boolean
  updateExperience: (experience: Experience[]) => void
  otherSkills: OtherSkill[];
  addOtherSkill: (skill: OtherSkill) => void
  editOtherSkill: (id: string, updatedSkill: OtherSkill) => void
  removeOtherSkill: (id: string) => void
}

// Definir los tipos para las secciones del contenido
export type Hero = {
  title: string
  subtitle: string
  description: string
  profileImage: string
}

export type About = {
  paragraph1: string
  paragraph2: string
  paragraph3: string
}

export type Service = {
  title: string
  description: string
  icon: string
}

export type Project = {
  id: number
  title: string
  description: string
  image?: string
  tags: string[]
  github: string
  demo: string
  createdAt?: string
}

export type Projects = {
  fullstack: Project[]
  backend: Project[]
}

// Definir el tipo para Skill
export type Skill = {
  name: string
  icon: string
  colored?: boolean
}

export type Skills = {
  frontend: Skill[]
  backend: Skill[]
  database: Skill[]
  devops: Skill[]
}

export type Contact = {
  email: string
  phone: string
  location: string
}

export type OtherSkill = {
  id: string;        
  name: string;      
};

// Actualizar el tipo Experience para incluir más campos detallados
export type Experience = {
  position: string
  company: string
  period: string
  description: string
  skills?: string[]
  companyLogo?: string
  location?: string
  achievements?: string[]
  url?: string
}

// Definir el tipo para el contenido general
export type Content = {
  hero: Hero
  about: About
  services: Service[]
  projects: Projects
  skills: Skills
  otherSkills: OtherSkill[]
  contact: Contact
  experience: Experience[]
}

// Crear el contexto
const ContentContext = createContext<ContentContextType | undefined>(undefined)

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

  // Función para guardar todo el contenido
  const saveAllContent = (): boolean => {
    try {
      // NOTA: Este bloque se puede reemplazar con una llamada a tu API/base de datos
      // Por ahora, guardamos en localStorage para mantener la funcionalidad del panel admin
      localStorage.setItem("portfolioContent", JSON.stringify(content))

      // Disparar un evento para notificar a otros componentes sobre la actualización
      if (typeof window !== "undefined") {
        const event = new CustomEvent("contentUpdated", { detail: content })
        window.dispatchEvent(event)
      }

      // En el futuro, aquí irá tu llamada a la API:
      // async function saveContent() {
      //   try {
      //     const response = await fetch('/api/content', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(content),
      //     });
      //     return response.ok;
      //   } catch (error) {
      //     console.error('Error saving content:', error);
      //     return false;
      //   }
      // }
      // return saveContent();

      return true
    } catch (error) {
      console.error("Error saving content to localStorage:", error)
      return false
    }
  }

  // Actualizar métodos para usar API
  const updateHero = async (hero: Hero) => {
    setIsLoading(true)
    try {
      const response = await updateContent('hero', hero)
      if (response.success) {
        setContent(prev => ({ ...prev, hero }))
      }
    } catch (error) {
      console.error("Error actualizando hero:", error)
    }
    setIsLoading(false)
  }

  const updateAbout = async (about: About) => {
    setIsLoading(true)
    try {
      const response = await updateContent('about', about)
      if (response.success) {
        setContent((prev) => ({ ...prev, about }))
      }
    } catch (error) {
      console.error("Error actualizando about:", error)
    }
    setIsLoading(false)
  }

  const updateServices = async (services: Service[]) => {
    setIsLoading(true)
    try {
      const response = await updateContent('services', services)
      if (response.success) {
        setContent((prev) => ({ ...prev, services }))
      }
    } catch (error) {
      console.error("Error actualizando services:", error)
    }
    setIsLoading(false)
  }

  const updateProjects = async (projects: Projects) => {
    setIsLoading(true)
    try {
      const response = await updateContent('projects', projects)
      if (response.success) {
        setContent((prev) => ({ ...prev, projects }))
      }
    } catch (error) {
      console.error("Error actualizando projects:", error)
    }
    setIsLoading(false)
  }

  const updateSkills = async (skills: Skills) => {
    setIsLoading(true)
    try {
      const response = await updateContent('skills', skills)
      if (response.success) {
        setContent((prev) => ({ ...prev, skills }))
      }
    } catch (error) {
      console.error("Error actualizando skills:", error)
    }
    setIsLoading(false)
  }

  const updateOtherSkills = async (otherSkills: OtherSkill[]) => {
    setIsLoading(true)
    try {
      const response = await updateContent('otherSkills', otherSkills)
      if (response.success) {
        setContent((prev) => ({ ...prev, otherSkills }))
      }
    } catch (error) {
      console.error("Error actualizando otherSkills:", error)
    }
    setIsLoading(false)
  }

  const updateContact = async (contact: Contact) => {
    setIsLoading(true)
    try {
      const response = await updateContent('contact', contact)
      if (response.success) {
        setContent((prev) => ({ ...prev, contact }))
      }
    } catch (error) {
      console.error("Error actualizando contact:", error)
    }
    setIsLoading(false)
  }

  const updateExperience = async (experience: Experience[]) => {
    setIsLoading(true)
    try {
      const response = await updateContent('experience', experience)
      if (response.success) {
        setContent((prev) => ({ ...prev, experience }))
      }
    } catch (error) {
      console.error("Error actualizando experience:", error)
    }
    setIsLoading(false)
  }

  const addOtherSkill = async (skill: OtherSkill) => {
    const response = await createOtherSkill(skill)
    if (response.success) {
      setOtherSkills((prev) => [...prev, response.data])
    }
  }

  const editOtherSkill = async (id: string, updatedSkill: OtherSkill) => {
    const response = await updateOtherSkill(id, updatedSkill)
    if (response.success) {
      setOtherSkills((prev) =>
        prev.map((skill) => (skill.id === id ? response.data : skill))
      )
    }
  }

  const removeOtherSkill = async (id: string) => {
    const response = await deleteOtherSkill(id)
    if (response.success) {
      setOtherSkills((prev) => prev.filter((skill) => skill.id !== id))
    }
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        updateHero,
        updateAbout,
        updateServices,
        updateProjects,
        updateSkills,
        updateOtherSkills,
        updateContact,
        saveAllContent,
        updateExperience,
        otherSkills,
        addOtherSkill,
        editOtherSkill,
        removeOtherSkill,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useContent = () => {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}