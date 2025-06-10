// Definiciones de tipos compartidos para el contexto de contenido

// Hero
export type Hero = {
  title: string
  subtitle: string
  description: string
  profileImage: string
}

// About
export type About = {
  paragraph1: string
  paragraph2: string
  paragraph3: string
}

// Service
export type Service = {
  title: string
  description: string
  icon: string
}

// Project
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

// Skill
export type Skill = {
  _id?: string
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

// Contact
export type Contact = {
  email: string
  phone: string
  location: string
}

// OtherSkill
export type OtherSkill = {
  _id?: string;  // Opcional porque será asignado por MongoDB al crear
  name: string;
};

// Experience
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

// Contenido general
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
