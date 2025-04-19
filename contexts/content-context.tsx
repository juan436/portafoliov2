"use client"

import { createContext, useState, useContext, type ReactNode, useEffect } from "react"

// Definir el tipo para Skill
export type Skill = {
  name: string
  icon: string
  colored?: boolean
}

// Definir el tipo para el contexto de contenido
type ContentContextType = {
  content: Content
  updateHero: (hero: Hero) => void
  updateAbout: (about: About) => void
  updateServices: (services: Service[]) => void
  updateProjects: (projects: Projects) => void
  updateSkills: (skills: Skills) => void
  updateOtherSkills: (otherSkills: string[]) => void
  updateContact: (contact: Contact) => void
  saveAllContent: () => boolean
  updateExperience: (experience: Experience[]) => void
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

// Actualizar el tipo Experience para incluir más campos detallados
export type Experience = {
  position: string
  company: string
  period: string
  description: string
  skills?: string[] // Campo para mostrar habilidades utilizadas
  companyLogo?: string // URL opcional del logo de la empresa
  location?: string // Ubicación opcional del trabajo
  achievements?: string[] // Logros destacados opcionales
  url?: string // Sitio web de la empresa opcional
}

// Definir el tipo para el contenido general
export type Content = {
  hero: Hero
  about: About
  services: Service[]
  projects: Projects
  skills: Skills
  otherSkills: string[]
  contact: Contact
  experience: Experience[]
}

// Crear el contexto
const ContentContext = createContext<ContentContextType | undefined>(undefined)

// Datos iniciales estáticos
const initialContent: Content = {
  hero: {
    title: "Juan Villegas",
    subtitle: "Desarrollador Full Stack",
    description:
      "Programador Full Stack con enfoque en desarrollo eficiente y escalable. Combino experiencia en front-end y back-end para crear soluciones de alto impacto y adaptadas a las necesidades del cliente.",
    profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  },
  about: {
    paragraph1:
      "Soy Juan Villegas, Programador Full Stack e Ingeniero en Telemática, especializado en el desarrollo de aplicaciones web y soluciones tecnológicas. Trabajo con JavaScript, PHP como lenguajes de programación principales.",
    paragraph2:
      "En el frontend, utilizo React.js y Next.js para construir interfaces dinámicas y responsivas. En el backend, desarrollo aplicaciones escalables con Node.js, Nest.js y Express.js, usando TypeScript para garantizar un código limpio. También trabajo con Laravel para crear soluciones eficientes y seguras. Gestiono bases de datos relacionales (MySQL, PostgreSQL) y no relacionales (MongoDB, Firebase).",
    paragraph3:
      "Mi formación en Telemática me proporciona un profundo conocimiento en redes de comunicaciones, respaldado por la certificación CCNA v7 de Cisco. Trabajo con Docker para despliegues eficientes y Git para control de versiones. Soy una persona apasionada por el aprendizaje continuo, con fuerte capacidad para resolver problemas y trabajar en equipo.",
  },
  services: [
    {
      title: "Desarrollo Frontend",
      description: "Interfaces modernas y responsivas con React, Next.js y otras tecnologías de vanguardia.",
      icon: "Code",
    },
    {
      title: "Desarrollo Backend",
      description: "APIs robustas y eficientes con Node.js, Express, PHP y Laravel.",
      icon: "Server",
    },
    {
      title: "Bases de Datos",
      description: "Diseño e implementación de bases de datos relacionales y no relacionales.",
      icon: "Database",
    },
    {
      title: "Soluciones Full Stack",
      description: "Desarrollo integral de aplicaciones web con arquitecturas escalables y mantenibles.",
      icon: "Cpu",
    },
  ],
  projects: {
    fullstack: [
      {
        id: 1,
        title: "Ecommerce Dashboard",
        description: "Dashboard para administración de tienda online.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        tags: ["React", "Node.js", "Express", "MongoDB"],
        github: "#",
        demo: "#",
        createdAt: "2023-01-15",
      },
      {
        id: 2,
        title: "Plataforma E-learning",
        description: "Plataforma para cursos online y gestión de estudiantes.",
        image: "https://images.unsplash.com/photo-1505373413586-02a9955747fe?q=80&w=2069&auto=format&fit=crop",
        tags: ["Next.js", "Firebase", "Tailwind CSS"],
        github: "#",
        demo: "#",
        createdAt: "2023-02-20",
      },
      {
        id: 3,
        title: "Sistema de Gestión",
        description: "Sistema para la gestión de tareas y proyectos.",
        image: "https://images.unsplash.com/photo-1587620962725-ead37f7effe8?q=80&w=2071&auto=format&fit=crop",
        tags: ["Vue.js", "Laravel", "MySQL"],
        github: "#",
        demo: "#",
        createdAt: "2023-03-10",
      },
    ],
    backend: [
      {
        id: 4,
        title: "API de Autenticación",
        description: "API para la autenticación de usuarios con JWT.",
        tags: ["Node.js", "Express", "JWT", "PostgreSQL"],
        github: "#",
        demo: "#",
        createdAt: "2023-04-05",
      },
      {
        id: 5,
        title: "Microservicio de Pagos",
        description: "Microservicio para la gestión de pagos con Stripe.",
        tags: ["Python", "Flask", "Stripe", "Redis"],
        github: "#",
        demo: "#",
        createdAt: "2023-05-12",
      },
      {
        id: 6,
        title: "Sistema de Notificaciones",
        description: "Sistema para el envío de notificaciones por email y SMS.",
        tags: ["PHP", "Laravel", "MySQL", "Twilio"],
        github: "#",
        demo: "#",
        createdAt: "2023-06-18",
      },
    ],
  },
  skills: {
    frontend: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
    ],
    backend: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "PHP", icon: "php" },
      { name: "Laravel", icon: "laravel" },
    ],
    database: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
    devops: [
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "AWS", icon: "amazonwebservices" },
    ],
  },
  otherSkills: ["Git", "REST APIs", "GraphQL", "Testing", "Agile"],
  contact: {
    email: "juan.villegas.dev@gmail.com",
    phone: "+58 414-7087374",
    location: "Barquisimeto, Venezuela",
  },
  experience: [
    {
      position: "Desarrollador Full Stack Senior",
      company: "TechSolutions Inc.",
      period: "2021 - Presente",
      description:
        "Lideré el desarrollo de aplicaciones web empresariales utilizando React, Node.js y MongoDB. Implementé arquitecturas escalables y optimicé el rendimiento de aplicaciones existentes.",
    },
    {
      position: "Desarrollador Full Stack",
      company: "WebDev Studios",
      period: "2019 - 2021",
      description:
        "Desarrollé y mantuve aplicaciones web con Vue.js y Laravel. Colaboré en la migración de sistemas legacy a arquitecturas modernas y participé en la implementación de CI/CD.",
    },
    {
      position: "Desarrollador Web Junior",
      company: "InnovateTech",
      period: "2018 - 2019",
      description:
        "Creé sitios web responsivos con WordPress y desarrollé plugins personalizados. Colaboré en el diseño UX/UI y optimicé sitios para SEO y rendimiento.",
    },
  ],
}

// Crear el proveedor
export const ContentProvider = ({ children }: { children: ReactNode }) => {
  // Usar los datos estáticos iniciales
  const [content, setContent] = useState<Content>(initialContent)

  useEffect(() => {
    // NOTA: Este bloque se puede reemplazar con una llamada a tu API/base de datos
    // Por ahora, cargamos desde localStorage para mantener la funcionalidad del panel admin
    const savedContent = localStorage.getItem("portfolioContent")
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        setContent(parsedContent)
      } catch (error) {
        console.error("Error parsing saved content from localStorage:", error)
      }
    }
    // En el futuro, aquí irá tu llamada a la API:
    // async function fetchContent() {
    //   try {
    //     const response = await fetch('/api/content');
    //     const data = await response.json();
    //     setContent(data);
    //   } catch (error) {
    //     console.error('Error fetching content:', error);
    //   }
    // }
    // fetchContent();
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

  // Funciones para actualizar secciones específicas del contenido
  const updateHero = (hero: Hero) => {
    setContent((prev) => ({ ...prev, hero }))
    // En el futuro: await fetch('/api/content/hero', { method: 'PUT', body: JSON.stringify(hero) });
  }

  const updateAbout = (about: About) => {
    setContent((prev) => ({ ...prev, about }))
    // En el futuro: await fetch('/api/content/about', { method: 'PUT', body: JSON.stringify(about) });
  }

  const updateServices = (services: Service[]) => {
    setContent((prev) => ({ ...prev, services }))
    // En el futuro: await fetch('/api/content/services', { method: 'PUT', body: JSON.stringify(services) });
  }

  const updateProjects = (projects: Projects) => {
    setContent((prev) => ({ ...prev, projects }))
    // En el futuro: await fetch('/api/content/projects', { method: 'PUT', body: JSON.stringify(projects) });
  }

  const updateSkills = (skills: Skills) => {
    setContent((prev) => ({ ...prev, skills }))
    // En el futuro: await fetch('/api/content/skills', { method: 'PUT', body: JSON.stringify(skills) });
  }

  const updateOtherSkills = (otherSkills: string[]) => {
    setContent((prev) => ({ ...prev, otherSkills }))
    // En el futuro: await fetch('/api/content/otherSkills', { method: 'PUT', body: JSON.stringify(otherSkills) });
  }

  const updateContact = (contact: Contact) => {
    setContent((prev) => ({ ...prev, contact }))
    // En el futuro: await fetch('/api/content/contact', { method: 'PUT', body: JSON.stringify(contact) });
  }

  const updateExperience = (experience: Experience[]) => {
    setContent((prev) => ({ ...prev, experience }))
    // En el futuro: await fetch('/api/content/experience', { method: 'PUT', body: JSON.stringify(experience) });
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        updateHero,
        updateAbout,
        updateServices,
        updateProjects,
        updateSkills,
        updateOtherSkills,
        updateContact,
        saveAllContent,
        updateExperience,
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
