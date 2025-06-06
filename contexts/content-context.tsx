"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import {
  fetchContent, fetchProjects, fetchExperiences, fetchSkills, fetchOtherSkills,
  createOtherSkill, updateOtherSkill, deleteOtherSkill, updateContent,
  // Importar funciones específicas para proyectos
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  // Importar funciones específicas para skills
  createSkill as createSkillApi,
  updateSkill as updateSkillApi,
  deleteSkill as deleteSkillApi,
  // Importar funciones específicas para experiencia
  createExperience as createExperienceApi,
  updateExperience as updateExperienceApi,
  deleteExperience as deleteExperienceApi
} from "@/services/api"

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
  // Métodos para OtherSkills
  addOtherSkill: (skill: OtherSkill) => void
  editOtherSkill: (id: string, updatedSkill: OtherSkill) => void
  removeOtherSkill: (id: string) => Promise<boolean>
  // Métodos para proyectos
  createProjectItem: (project: Omit<Project, "id">, category: 'fullstack' | 'backend') => Promise<Project | null>
  updateProjectItem: (id: string, project: Project, category: 'fullstack' | 'backend') => Promise<boolean>
  deleteProjectItem: (id: string, category: 'fullstack' | 'backend') => Promise<boolean>
  // Métodos para skills
  createSkillItem: (skillData: Omit<Skill, "_id">) => Promise<Skill | null>
  updateSkillItem: (id: string, skill: Skill) => Promise<boolean>
  deleteSkillItem: (id: string) => Promise<boolean>
  // Métodos para experiencia
  createExperienceItem: (experience: Omit<Experience, "_id">) => Promise<Experience | null>
  updateExperienceItem: (id: string, experience: Experience) => Promise<boolean>
  deleteExperienceItem: (id: string) => Promise<boolean>
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
  _id: string
  name: string
  icon: string
  category: string
  colored: boolean
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
  _id?: string;  // Opcional porque será asignado por MongoDB al crear
  name: string;
};

// Actualizar el tipo Experience para incluir más campos detallados
export type Experience = {
  _id?: string;
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

  // Actualizar métodos para usar API
  const updateHero = async (hero: Hero) => {
    console.log("ContentContext updateHero - inicio", { hero, isLoading });
    
    // Actualizar inmediatamente el estado local para evitar el parpadeo
    setContent(prev => ({ ...prev, hero: { ...hero } }));
    
    // Luego actualizar en el servidor
    setIsLoading(true)
    try {
      const response = await updateContent('hero', hero)
      console.log("ContentContext updateHero - respuesta API", { response });
      // No es necesario actualizar el estado de nuevo aquí, ya lo hicimos arriba
    } catch (error) {
      console.error("Error actualizando hero:", error)
      // En caso de error, podríamos revertir al estado anterior
    }
    console.log("ContentContext updateHero - fin", { hero, isLoading: false });
    setIsLoading(false)
  }

  const updateAbout = async (about: About) => {
    console.log("ContentContext updateAbout - inicio", { about, isLoading });
    
    // Actualizar inmediatamente el estado local para evitar el parpadeo
    setContent((prev) => ({ ...prev, about: { ...about } }));
    
    // Luego actualizar en el servidor
    setIsLoading(true)
    try {
      const response = await updateContent('about', about)
      console.log("ContentContext updateAbout - respuesta API", { response });
      // No es necesario actualizar el estado de nuevo aquí, ya lo hicimos arriba
    } catch (error) {
      console.error("Error actualizando about:", error)
      // En caso de error, podríamos revertir al estado anterior
    }
    console.log("ContentContext updateAbout - fin", { about, isLoading: false });
    setIsLoading(false)
  }

  const updateServices = async (services: Service[]) => {
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

  // Añadir nuevos métodos específicos para proyectos
  const createProjectItem = async (projectData: Omit<Project, "id">, category: 'fullstack' | 'backend'): Promise<Project | null> => {
    setIsLoading(true)
    try {
      // Preparar el proyecto para la API
      const projectToCreate = {
        ...projectData,
        category
      }

      // Llamar a la API para crear el proyecto
      const response = await createProjectApi(projectToCreate)

      if (response.success && response.data) {
        // Formatear el proyecto creado
        const newProject: Project = {
          id: response.data._id,
          title: response.data.title,
          description: response.data.description,
          image: response.data.image,
          tags: response.data.tags || [],
          github: response.data.github || "#",
          demo: response.data.demo || "#",
          createdAt: response.data.createdAt
        }

        // Actualizar el estado local
        if (category === 'fullstack') {
          setContent(prev => ({
            ...prev,
            projects: {
              ...prev.projects,
              fullstack: [...prev.projects.fullstack, newProject]
            }
          }))
        } else {
          setContent(prev => ({
            ...prev,
            projects: {
              ...prev.projects,
              backend: [...prev.projects.backend, newProject]
            }
          }))
        }

        setIsLoading(false)
        return newProject
      }

      setIsLoading(false)
      return null
    } catch (error) {
      console.error("Error creando proyecto:", error)
      setIsLoading(false)
      return null
    }
  }

  const updateProjectItem = async (id: string, project: Project, category: 'fullstack' | 'backend'): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Preparar proyecto para la API
      const projectToUpdate = {
        ...project,
        category
      }

      // Llamar a la API para actualizar el proyecto
      const response = await updateProjectApi(id, projectToUpdate)

      if (response.success) {
        // Actualizar el estado local
        if (category === 'fullstack') {
          const updatedProjects = content.projects.fullstack.map(p =>
            p.id.toString() === id ? project : p
          )

          setContent(prev => ({
            ...prev,
            projects: {
              ...prev.projects,
              fullstack: updatedProjects
            }
          }))
        } else {
          const updatedProjects = content.projects.backend.map(p =>
            p.id.toString() === id ? project : p
          )

          setContent(prev => ({
            ...prev,
            projects: {
              ...prev.projects,
              backend: updatedProjects
            }
          }))
        }

        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error actualizando proyecto:", error)
      setIsLoading(false)
      return false
    }
  }

  const deleteProjectItem = async (id: string, category: 'fullstack' | 'backend'): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Llamar a la API para eliminar el proyecto
      const response = await deleteProjectApi(id)

      if (response.success) {
        // Actualizar el estado local
        if (category === 'fullstack') {
          const filteredProjects = content.projects.fullstack.filter(
            p => p.id.toString() !== id
          )

          setContent(prev => ({
            ...prev,
            projects: {
              ...prev.projects,
              fullstack: filteredProjects
            }
          }))
        } else {
          const filteredProjects = content.projects.backend.filter(
            p => p.id.toString() !== id
          )

          setContent(prev => ({
            ...prev,
            projects: {
              ...prev.projects,
              backend: filteredProjects
            }
          }))
        }

        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error eliminando proyecto:", error)
      setIsLoading(false)
      return false
    }
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

  // Añadir nuevos métodos específicos para skills
  const createSkillItem = async (skillData: Omit<Skill, "_id">): Promise<Skill | null> => {
    setIsLoading(true)
    try {
      // Llamar a la API para crear la skill
      const response = await createSkillApi(skillData)

      if (response.success && response.data) {
        // Formatear la skill creada
        const newSkill: Skill = {
          _id: response.data._id,
          name: response.data.name,
          icon: response.data.icon,
          category: response.data.category,
          colored: response.data.colored
        }

        console.log("Skill creada:", newSkill);

        // Actualizar el estado local según la categoría
        setContent(prev => {
          const updatedSkills = { ...prev.skills };

          // Añadir la nueva skill a la categoría correspondiente
          if (newSkill.category === 'frontend') {
            updatedSkills.frontend = [...updatedSkills.frontend, newSkill];
          } else if (newSkill.category === 'backend') {
            updatedSkills.backend = [...updatedSkills.backend, newSkill];
          } else if (newSkill.category === 'database') {
            updatedSkills.database = [...updatedSkills.database, newSkill];
          } else if (newSkill.category === 'devops') {
            updatedSkills.devops = [...updatedSkills.devops, newSkill];
          }

          return {
            ...prev,
            skills: updatedSkills
          };
        });

        setIsLoading(false)
        return newSkill
      }

      setIsLoading(false)
      return null
    } catch (error) {
      console.error("Error creando skill:", error)
      setIsLoading(false)
      return null
    }
  }

  const updateSkillItem = async (id: string, skill: Skill): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Asegurarnos que estamos pasando el objeto correcto a la API
      // No necesitamos hacer ajustes al objeto skill, ya que ya contiene la categoría
      const response = await updateSkillApi(id, skill)

      if (response.success) {
        // Actualizar el estado local según la categoría
        setContent(prev => {
          const updatedSkills = { ...prev.skills };
          const category = skill.category;

          // Actualizar la skill en la categoría correspondiente
          if (category === 'frontend') {
            updatedSkills.frontend = updatedSkills.frontend.map(s => {
              const skillId = s._id || s.id;
              return (skillId?.toString() || '') === id ? skill : s;
            });
          } else if (category === 'backend') {
            updatedSkills.backend = updatedSkills.backend.map(s => {
              const skillId = s._id || s.id;
              return (skillId?.toString() || '') === id ? skill : s;
            });
          } else if (category === 'database') {
            updatedSkills.database = updatedSkills.database.map(s => {
              const skillId = s._id || s.id;
              return (skillId?.toString() || '') === id ? skill : s;
            });
          } else if (category === 'devops') {
            updatedSkills.devops = updatedSkills.devops.map(s => {
              const skillId = s._id || s.id;
              return (skillId?.toString() || '') === id ? skill : s;
            });
          }

          return {
            ...prev,
            skills: updatedSkills
          };
        });

        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error actualizando skill:", error)
      setIsLoading(false)
      return false
    }
  }

  const deleteSkillItem = async (id: string): Promise<boolean> => {
    // Verificar que el ID sea válido
    if (!id) {
      console.error('Se intentó eliminar una skill con ID undefined');
      return false;
    }

    setIsLoading(true)
    try {
      // Primero necesitamos encontrar la skill para saber su categoría
      let skillCategory = '';
      let skillFound = false;

      // Buscar en todas las categorías
      for (const category of ['frontend', 'backend', 'database', 'devops'] as const) {
        // Buscar por _id
        const found = content.skills[category].find(s => s._id === id);
        if (found) {
          skillCategory = category;
          skillFound = true;
          break;
        }
      }

      if (!skillFound) {
        console.error(`No se encontró la skill con ID ${id} en ninguna categoría`);
        setIsLoading(false);
        return false;
      }

      // Llamar a la API para eliminar la skill
      const response = await deleteSkillApi(id);

      if (response.success) {
        // Actualizar el estado local
        setContent(prev => {
          const updatedSkills = { ...prev.skills };

          // Eliminar la skill de la categoría correspondiente
          if (skillCategory === 'frontend') {
            updatedSkills.frontend = updatedSkills.frontend.filter(s => s._id !== id);
          } else if (skillCategory === 'backend') {
            updatedSkills.backend = updatedSkills.backend.filter(s => s._id !== id);
          } else if (skillCategory === 'database') {
            updatedSkills.database = updatedSkills.database.filter(s => s._id !== id);
          } else if (skillCategory === 'devops') {
            updatedSkills.devops = updatedSkills.devops.filter(s => s._id !== id);
          }

          return {
            ...prev,
            skills: updatedSkills
          };
        });

        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Error eliminando skill:", error);
      setIsLoading(false);
      return false;
    }
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



  // Operaciones para OtherSkills
  const addOtherSkill = async (skill: OtherSkill) => {
    try {
      const response = await createOtherSkill(skill)
      if (response.success) {
        setOtherSkills(prev => [...prev, response.data])

        // Actualizar también el contenido global
        setContent(prev => ({
          ...prev,
          otherSkills: [...prev.otherSkills, response.data]
        }))
      }
    } catch (error) {
      console.error("Error añadiendo habilidad:", error)
    }
  }

  const editOtherSkill = async (id: string, updatedSkill: OtherSkill) => {
    try {
      const response = await updateOtherSkill(id, updatedSkill)
      if (response.success) {
        // Actualizar el estado local de otherSkills con los datos devueltos por el servidor
        setOtherSkills(prev =>
          prev.map(skill => skill._id === id ? response.data : skill)
        )

        // Actualizar también el contenido global
        setContent(prev => ({
          ...prev,
          otherSkills: prev.otherSkills.map(
            skill => skill._id === id ? response.data : skill
          )
        }))
        
        return response
      }
      return response
    } catch (error) {
      console.error("Error editando habilidad:", error)
      return { success: false, message: error.message }
    }
  }

  const removeOtherSkill = async (id: string): Promise<boolean> => {
    try {
      const response = await deleteOtherSkill(id)
      if (response.success) {
        // Actualizar el estado local de otherSkills
        setOtherSkills(prev => prev.filter(skill => skill._id !== id))

        // Actualizar también el contenido global
        setContent(prev => ({
          ...prev,
          otherSkills: prev.otherSkills.filter(skill => skill._id !== id)
        }))
        
        // Devolver true para indicar éxito
        return true
      } else {
        // Si la API devuelve un error, devolver false
        return false
      }
    } catch (error) {
      console.error("Error eliminando habilidad:", error)
      return false
    }
  }

  // Nuevos métodos para experiencia
  const createExperienceItem = async (experienceData: Omit<Experience, "_id">): Promise<Experience | null> => {
    setIsLoading(true)
    try {
      // Llamar a la API para crear la experiencia
      const response = await createExperienceApi(experienceData)

      if (response.success && response.data) {
        // Formatear la experiencia creada
        const newExperience: Experience = {
          _id: response.data._id,
          position: response.data.position,
          company: response.data.company,
          period: response.data.period,
          description: response.data.description,
          skills: response.data.skills,
          companyLogo: response.data.companyLogo,
          location: response.data.location,
          achievements: response.data.achievements,
          url: response.data.url
        }

        // Actualizar el estado local
        setContent(prev => ({
          ...prev,
          experience: [...prev.experience, newExperience]
        }))

        setIsLoading(false)
        return newExperience
      }

      setIsLoading(false)
      return null
    } catch (error) {
      console.error("Error creando experiencia:", error)
      setIsLoading(false)
      return null
    }
  }

  const updateExperienceItem = async (id: string, experience: Experience): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Llamar a la API para actualizar la experiencia
      const response = await updateExperienceApi(id, experience)

      if (response.success) {
        // Actualizar el estado local
        setContent(prev => ({
          ...prev,
          experience: prev.experience.map(e => e._id === id ? experience : e)
        }))

        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error actualizando experiencia:", error)
      setIsLoading(false)
      return false
    }
  }

  const deleteExperienceItem = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Llamar a la API para eliminar la experiencia
      const response = await deleteExperienceApi(id)

      if (response.success) {
        // Actualizar el estado local
        setContent(prev => ({
          ...prev,
          experience: prev.experience.filter(e => e._id !== id)
        }))

        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error eliminando experiencia:", error)
      setIsLoading(false)
      return false
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  const updateContact = async (contact: Contact) => {
    console.log("ContentContext updateContact - inicio", { contact, isLoading });
    
    // Actualizar inmediatamente el estado local para evitar el parpadeo
    setContent((prev) => ({ ...prev, contact: { ...contact } }));
    
    // Luego actualizar en el servidor
    setIsLoading(true)
    try {
      const response = await updateContent('contact', contact)
      console.log("ContentContext updateContact - respuesta API", { response });
      // No es necesario actualizar el estado de nuevo aquí, ya lo hicimos arriba
    } catch (error) {
      console.error("Error actualizando contact:", error)
      // En caso de error, podríamos revertir al estado anterior
    }
    console.log("ContentContext updateContact - fin", { contact, isLoading: false });
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
        // Nuevos métodos para proyectos
        createProjectItem,
        updateProjectItem,
        deleteProjectItem,
        // Nuevos métodos para skills
        createSkillItem,
        updateSkillItem,
        deleteSkillItem,
        // Nuevos métodos para experiencia
        createExperienceItem,
        updateExperienceItem,
        deleteExperienceItem
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