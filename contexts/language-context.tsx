"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

// Definir los idiomas disponibles
export type LanguageCode = "es" | "en" | "it" | "fr"

export type Language = {
  code: LanguageCode
  name: string
  flag: string
}

export const languages: Language[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

// Definir las traducciones
export const translations = {
  // Español
  es: {
    // Navbar
    "nav.home": "Inicio",
    "nav.about": "Sobre Mí",
    "nav.projects": "Proyectos",
    "nav.skills": "Habilidades",
    "nav.contact": "Contacto",
    "nav.experience": "Experiencia",

    // Hero
    "hero.title": "Juan Villegas",
    "hero.subtitle": "Desarrollador Full Stack",
    "hero.description":
      "Programador Full Stack con enfoque en desarrollo eficiente y escalable. Combino experiencia en front-end y back-end para crear soluciones de alto impacto y adaptadas a las necesidades del cliente.",
    "hero.projects": "Ver Proyectos",
    "hero.contact": "Contactarme",

    // About
    "about.title": "Sobre Mí",
    "about.role": "Desarrollador Full Stack",
    "about.engineer": "Ingeniero en Telemática",
    "about.university": 'Universidad Centroccidental "Lisandro Alvarado"',
    "about.paragraph1":
      "Soy Juan Villegas, Programador Full Stack e Ingeniero en Telemática, especializado en el desarrollo de aplicaciones web y soluciones tecnológicas. Trabajo con JavaScript, PHP como lenguajes de programación principales.",
    "about.paragraph2":
      "En el frontend, utilizo React.js y Next.js para construir interfaces dinámicas y responsivas. En el backend, desarrollo aplicaciones escalables con Node.js, Nest.js y Express.js, usando TypeScript para garantizar un código limpio. También trabajo con Laravel para crear soluciones eficientes y seguras. Gestiono bases de datos relacionales (MySQL, PostgreSQL) y no relacionales (MongoDB, Firebase).",
    "about.paragraph3":
      "Mi formación en Telemática me proporciona un profundo conocimiento en redes de comunicaciones, respaldado por la certificación CCNA v7 de Cisco. Trabajo con Docker para despliegues eficientes y Git para control de versiones. Soy una persona apasionada por el aprendizaje continuo, con fuerte capacidad para resolver problemas y trabajar en equipo.",
    "about.downloadCV": "Descargar CV",

    // Services
    "services.frontend": "Desarrollo Frontend",
    "services.frontend.desc": "Interfaces modernas y responsivas con React, Next.js y otras tecnologías de vanguardia.",
    "services.backend": "Desarrollo Backend",
    "services.backend.desc": "APIs robustas y eficientes con Node.js, Express, PHP y Laravel.",
    "services.database": "Bases de Datos",
    "services.database.desc": "Diseño e implementación de bases de datos relacionales y no relacionales.",
    "services.fullstack": "Soluciones Full Stack",
    "services.fullstack.desc": "Desarrollo integral de aplicaciones web con arquitecturas escalables y mantenibles.",

    // Projects
    "projects.title": "Mis Proyectos",
    "projects.subtitle":
      "Una selección de mis proyectos más recientes y destacados. Cada proyecto refleja mi enfoque en la calidad, la experiencia del usuario y el código limpio.",
    "projects.fullstack": "Full Stack",
    "projects.backend": "Backend",
    "projects.viewMore.fullstack": "Ver más proyectos Full Stack",
    "projects.viewMore.backend": "Ver más proyectos Backend",
    "projects.code": "Código",
    "projects.demo": "Demo",
    "projects.repo": "Repositorio",
    "projects.docs": "Documentación",
    "projects.viewMore": "Ver más proyectos",
    "projects.backToHome": "Volver",
    "projects.noProjects": "No hay proyectos disponibles en este momento.",

    // Skills
    "skills.title": "Mis Habilidades",
    "skills.subtitle":
      "Tecnologías y herramientas que utilizo para crear soluciones web completas y eficientes. Mi experiencia está respaldada por los proyectos que he desarrollado.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.database": "Bases de Datos",
    "skills.devops": "DevOps",
    "skills.other": "Otras Habilidades",
    "skills.experience":
      "Las habilidades mostradas están respaldadas por proyectos reales y experiencia práctica. Puedes ver ejemplos de mi trabajo en la sección de proyectos.",

    // Contact
    "contact.title": "Contacto",
    "contact.subtitle":
      "¿Tienes un proyecto en mente? ¡Hablemos! Estoy disponible para trabajar en proyectos freelance o posiciones a tiempo completo.",
    "contact.info": "Información de Contacto",
    "contact.email": "Email",
    "contact.phone": "Teléfono",
    "contact.location": "Ubicación",
    "contact.form.name": "Nombre",
    "contact.form.email": "Email",
    "contact.form.subject": "Asunto",
    "contact.form.message": "Mensaje",
    "contact.form.send": "Enviar Mensaje",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.role": "Desarrollador Full Stack",

    // Wolf Guide
    "wolf.welcome":
      "¡Hola! Soy Juan Villegas. Bienvenidos a mi espacio virtual donde la tecnología y la creatividad se encuentran.",
    "wolf.about":
      "¡Hola de nuevo! Soy Juan, un apasionado del desarrollo y la tecnología. Aquí descubrirás un poco sobre mi historia.",
    "wolf.skills":
      "¡Mira todo lo que puedo hacer! Desde backend sólido hasta magia full-stack, esta sección destaca mis fortalezas.",
    "wolf.projects":
      "¡Aquí están mis creaciones! Explora mis proyectos full-stack y backend, diseñados con pasión y perfección.",
    "wolf.contact":
      "¿Trabajamos juntos? Escríbeme. Estoy a un mensaje de distancia para transformar tus ideas en realidad.",

    // Wolf Guide Short Messages
    "wolf.welcome.short": "¡Hola! Bienvenido",
    "wolf.about.short": "¡Sobre mí!",
    "wolf.skills.short": "Mis habilidades",
    "wolf.projects.short": "Mis proyectos",
    "wolf.contact.short": "¡Contáctame!",

    // Experience
    "experience.title": "Experiencia Laboral",
    "experience.subtitle": "Mi trayectoria profesional y los roles que he desempeñado en diferentes empresas.",
    "experience.position1": "Desarrollador Full Stack Senior",
    "experience.description1":
      "Lideré el desarrollo de aplicaciones web empresariales utilizando React, Node.js y MongoDB. Implementé arquitecturas escalables y optimicé el rendimiento de aplicaciones existentes.",
    "experience.position2": "Desarrollador Full Stack",
    "experience.description2":
      "Desarrollé y mantuve aplicaciones web con Vue.js y Laravel. Colaboré en la migración de sistemas legacy a arquitecturas modernas y participé en la implementación de CI/CD.",
    "experience.position3": "Desarrollador Web Junior",
    "experience.description3":
      "Creé sitios web responsivos con WordPress y desarrollé plugins personalizados. Colaboré en el diseño UX/UI y optimicé sitios para SEO y rendimiento.",

    "wolf.experience":
      "¡Mira mi trayectoria profesional! Aquí encontrarás mi experiencia y los roles que he desempeñado a lo largo de mi carrera.",
    "wolf.experience.short": "¡Mi experiencia!",
  },

  // English
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.about": "About Me",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.contact": "Contact",
    "nav.experience": "Experience",

    // Hero
    "hero.title": "Juan Villegas",
    "hero.subtitle": "Full Stack Developer",
    "hero.description":
      "Full Stack programmer focused on efficient and scalable development. I combine front-end and back-end experience to create high-impact solutions tailored to client needs.",
    "hero.projects": "View Projects",
    "hero.contact": "Contact Me",

    // About
    "about.title": "About Me",
    "about.role": "Full Stack Developer",
    "about.engineer": "Telematics Engineer",
    "about.university": 'Universidad Centroccidental "Lisandro Alvarado"',
    "about.paragraph1":
      "I'm Juan Villegas, a Full Stack Programmer and Telematics Engineer, specialized in web application development and technological solutions. I work with JavaScript and PHP as my main programming languages.",
    "about.paragraph2":
      "In frontend, I use React.js and Next.js to build dynamic and responsive interfaces. In backend, I develop scalable applications with Node.js, Nest.js, and Express.js, using TypeScript to ensure clean code. I also work with Laravel to create efficient and secure solutions. I manage both relational databases (MySQL, PostgreSQL) and non-relational databases (MongoDB, Firebase).",
    "about.paragraph3":
      "My Telematics background provides me with deep knowledge in communication networks, backed by the Cisco CCNA v7 certification. I work with Docker for efficient deployments and Git for version control. I am passionate about continuous learning, with strong problem-solving abilities and teamwork skills.",
    "about.downloadCV": "Download CV",

    // Services
    "services.frontend": "Frontend Development",
    "services.frontend.desc":
      "Modern and responsive interfaces with React, Next.js, and other cutting-edge technologies.",
    "services.backend": "Backend Development",
    "services.backend.desc": "Robust and efficient APIs with Node.js, Express, PHP, and Laravel.",
    "services.database": "Databases",
    "services.database.desc": "Design and implementation of relational and non-relational databases.",
    "services.fullstack": "Full Stack Solutions",
    "services.fullstack.desc":
      "Comprehensive development of web applications with scalable and maintainable architectures.",

    // Projects
    "projects.title": "My Projects",
    "projects.subtitle":
      "A selection of my most recent and outstanding projects. Each project reflects my focus on quality, user experience, and clean code.",
    "projects.fullstack": "Full Stack",
    "projects.backend": "Backend",
    "projects.viewMore.fullstack": "View more Full Stack projects",
    "projects.viewMore.backend": "View more Backend projects",
    "projects.code": "Code",
    "projects.demo": "Demo",
    "projects.repo": "Repository",
    "projects.docs": "Documentation",
    "projects.viewMore": "View more projects",
    "projects.backToHome": "Back",
    "projects.noProjects": "No projects available at this time.",

    // Skills
    "skills.title": "My Skills",
    "skills.subtitle":
      "Technologies and tools I use to create complete and efficient web solutions. My experience is backed by the projects I have developed.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.database": "Databases",
    "skills.devops": "DevOps",
    "skills.other": "Other Skills",
    "skills.experience":
      "The skills shown are backed by real projects and practical experience. You can see examples of my work in the projects section.",

    // Contact
    "contact.title": "Contact",
    "contact.subtitle":
      "Do you have a project in mind? Let's talk! I'm available for freelance projects or full-time positions.",
    "contact.info": "Contact Information",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.send": "Send Message",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.role": "Full Stack Developer",

    // Wolf Guide
    "wolf.welcome": "Hello! I'm Juan Villegas. Welcome to my virtual space where technology and creativity meet.",
    "wolf.about":
      "Hello again! I'm Juan, passionate about development and technology. Here you'll discover a bit about my story.",
    "wolf.skills":
      "Look at everything I can do! From solid backend to full-stack magic, this section highlights my strengths.",
    "wolf.projects":
      "Here are my creations! Explore my full-stack and backend projects, designed with passion and precision.",
    "wolf.contact":
      "Shall we work together? Write to me. I'm just a message away to transform your ideas into reality.",

    // Wolf Guide Short Messages
    "wolf.welcome.short": "Hello! Welcome",
    "wolf.about.short": "About me!",
    "wolf.skills.short": "My skills",
    "wolf.projects.short": "My projects",
    "wolf.contact.short": "Contact me!",

    // Experience
    "experience.title": "Work Experience",
    "experience.subtitle": "My professional journey and the roles I've played in different companies.",
    "experience.position1": "Senior Full Stack Developer",
    "experience.description1":
      "Led the development of enterprise web applications using React, Node.js, and MongoDB. Implemented scalable architectures and optimized the performance of existing applications.",
    "experience.position2": "Full Stack Developer",
    "experience.description2":
      "Developed and maintained web applications with Vue.js and Laravel. Collaborated in migrating legacy systems to modern architectures and participated in CI/CD implementation.",
    "experience.position3": "Junior Web Developer",
    "experience.description3":
      "Created responsive websites with WordPress and developed custom plugins. Collaborated in UX/UI design and optimized sites for SEO and performance.",

    "wolf.experience":
      "Check out my professional journey! Here you'll find my experience and the roles I've played throughout my career.",
    "wolf.experience.short": "My experience!",
  },

  // Italian
  it: {
    // Navbar
    "nav.home": "Inizio",
    "nav.about": "Chi Sono",
    "nav.projects": "Progetti",
    "nav.skills": "Competenze",
    "nav.contact": "Contatto",
    "nav.experience": "Esperienza",

    // Hero
    "hero.title": "Juan Villegas",
    "hero.subtitle": "Sviluppatore Full Stack",
    "hero.description":
      "Programmatore Full Stack con focus sullo sviluppo efficiente e scalabile. Combino esperienza front-end e back-end per creare soluzioni ad alto impatto e su misura per le esigenze del cliente.",
    "hero.projects": "Vedi Progetti",
    "hero.contact": "Contattami",

    // About
    "about.title": "Chi Sono",
    "about.role": "Sviluppatore Full Stack",
    "about.engineer": "Ingegnere in Telematica",
    "about.university": 'Università Centroccidentale "Lisandro Alvarado"',
    "about.paragraph1":
      "Sono Juan Villegas, Programmatore Full Stack e Ingegnere in Telematica, specializzato nello sviluppo di applicazioni web e soluzioni tecnologiche. Lavoro principalmente con JavaScript e PHP come linguaggi di programmazione.",
    "about.paragraph2":
      "Nel frontend, utilizzo React.js e Next.js per costruire interfacce dinamiche e responsive. Nel backend, sviluppo applicazioni scalabili con Node.js, Nest.js ed Express.js, utilizzando TypeScript per garantire un codice pulito. Lavoro anche con Laravel per creare soluzioni efficienti e sicure. Gestisco database relazionali (MySQL, PostgreSQL) e non relazionali (MongoDB, Firebase).",
    "about.paragraph3":
      "La mia formazione in Telematica mi fornisce una profonda conoscenza delle reti di comunicazione, supportata dalla certificazione CCNA v7 di Cisco. Lavoro con Docker per deployment efficienti e Git per il controllo di versione. Sono una persona appassionata di apprendimento continuo, con forti capacità di problem solving e di lavoro in team.",
    "about.downloadCV": "Scarica CV",

    // Services
    "services.frontend": "Sviluppo Frontend",
    "services.frontend.desc": "Interfacce moderne e responsive con React, Next.js e altre tecnologie all'avanguardia.",
    "services.backend": "Sviluppo Backend",
    "services.backend.desc": "API robuste ed efficienti con Node.js, Express, PHP e Laravel.",
    "services.database": "Database",
    "services.database.desc": "Progettazione e implementazione di database relazionali e non relazionali.",
    "services.fullstack": "Soluzioni Full Stack",
    "services.fullstack.desc": "Sviluppo completo di applicazioni web con architetture scalabili e manutenibili.",

    // Projects
    "projects.title": "I Miei Progetti",
    "projects.subtitle":
      "Una selezione dei miei progetti più recenti e importanti. Ogni progetto riflette la mia attenzione alla qualità, all'esperienza utente e al codice pulito.",
    "projects.fullstack": "Full Stack",
    "projects.backend": "Backend",
    "projects.viewMore.fullstack": "Vedi altri progetti Full Stack",
    "projects.viewMore.backend": "Vedi altri progetti Backend",
    "projects.code": "Codice",
    "projects.demo": "Demo",
    "projects.repo": "Repository",
    "projects.docs": "Documentazione",
    "projects.viewMore": "Vedi altri progetti",
    "projects.backToHome": "Indietro",
    "projects.noProjects": "Nessun progetto disponibile al momento.",

    // Skills
    "skills.title": "Le Mie Competenze",
    "skills.subtitle":
      "Tecnologie e strumenti che utilizzo per creare soluzioni web complete ed efficienti. La mia esperienza è supportata dai progetti che ho sviluppato.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.database": "Database",
    "skills.devops": "DevOps",
    "skills.other": "Altre Competenze",
    "skills.experience":
      "Le competenze mostrate sono supportate da progetti reali ed esperienza pratica. Puoi vedere esempi del mio lavoro nella sezione progetti.",

    // Contact
    "contact.title": "Contatto",
    "contact.subtitle":
      "Hai un progetto in mente? Parliamone! Sono disponibile per progetti freelance o posizioni a tempo pieno.",
    "contact.info": "Informazioni di Contatto",
    "contact.email": "Email",
    "contact.phone": "Telefono",
    "contact.location": "Posizione",
    "contact.form.name": "Nome",
    "contact.form.email": "Email",
    "contact.form.subject": "Oggetto",
    "contact.form.message": "Messaggio",
    "contact.form.send": "Invia Messaggio",

    // Footer
    "footer.rights": "Tutti i diritti riservati.",
    "footer.role": "Sviluppatore Full Stack",

    // Wolf Guide
    "wolf.welcome":
      "Ciao! Sono Juan Villegas. Benvenuto nel mio spazio virtuale dove tecnologia e creatività si incontrano.",
    "wolf.about":
      "Ciao di nuovo! Sono Juan, appassionato di sviluppo e tecnologia. Qui scoprirai un po' della mia storia.",
    "wolf.skills":
      "Guarda tutto ciò che so fare! Dal backend solido alla magia full-stack, questa sezione evidenzia i miei punti di forza.",
    "wolf.projects":
      "Ecco le mie creazioni! Esplora i miei progetti full-stack e backend, progettati con passione e precisione.",
    "wolf.contact":
      "Lavoriamo insieme? Scrivimi. Sono a un messaggio di distanza per trasformare le tue idee in realtà.",

    // Wolf Guide Short Messages
    "wolf.welcome.short": "Ciao! Benvenuto",
    "wolf.about.short": "Chi sono!",
    "wolf.skills.short": "Le mie abilità",
    "wolf.projects.short": "I miei progetti",
    "wolf.contact.short": "Contattami!",

    // Experience
    "experience.title": "Esperienza Lavorativa",
    "experience.subtitle": "Il mio percorso professionale e i ruoli che ho ricoperto in diverse aziende.",
    "experience.position1": "Sviluppatore Full Stack Senior",
    "experience.description1":
      "Ho guidato lo sviluppo di applicazioni web aziendali utilizzando React, Node.js e MongoDB. Ho implementato architetture scalabili e ottimizzato le prestazioni delle applicazioni esistenti.",
    "experience.position2": "Sviluppatore Full Stack",
    "experience.description2":
      "Ho sviluppato e mantenuto applicazioni web con Vue.js e Laravel. Ho collaborato alla migrazione di sistemi legacy verso architetture moderne e partecipato all'implementazione di CI/CD.",
    "experience.position3": "Sviluppatore Web Junior",
    "experience.description3":
      "Ho creato siti web responsive con WordPress e sviluppato plugin personalizzati. Ho collaborato al design UX/UI e ottimizzato i siti per SEO e prestazioni.",

    "wolf.experience":
      "Dai un'occhiata al mio percorso professionale! Qui troverai la mia esperienza e i ruoli che ho ricoperto durante la mia carriera.",
    "wolf.experience.short": "La mia esperienza!",
  },

  // French
  fr: {
    // Navbar
    "nav.home": "Accueil",
    "nav.about": "À Propos",
    "nav.projects": "Projets",
    "nav.skills": "Compétences",
    "nav.contact": "Contact",
    "nav.experience": "Expérience",

    // Hero
    "hero.title": "Juan Villegas",
    "hero.subtitle": "Développeur Full Stack",
    "hero.description":
      "Programmeur Full Stack axé sur le développement efficace et évolutif. Je combine l'expérience front-end et back-end pour créer des solutions à fort impact adaptées aux besoins du client.",
    "hero.projects": "Voir les Projets",
    "hero.contact": "Me Contacter",

    // About
    "about.title": "À Propos de Moi",
    "about.role": "Développeur Full Stack",
    "about.engineer": "Ingénieur en Télématique",
    "about.university": 'Université Centroccidentale "Lisandro Alvarado"',
    "about.paragraph1":
      "Je suis Juan Villegas, Programmeur Full Stack et Ingénieur en Télématique, spécialisé dans le développement d'applications web et de solutions technologiques. Je travaille principalement avec JavaScript et PHP comme langages de programmation.",
    "about.paragraph2":
      "En frontend, j'utilise React.js et Next.js pour construire des interfaces dynamiques et responsives. En backend, je développe des applications évolutives avec Node.js, Nest.js et Express.js, en utilisant TypeScript pour garantir un code propre. Je travaille également avec Laravel pour créer des solutions efficaces et sécurisées. Je gère des bases de données relationnelles (MySQL, PostgreSQL) et non relationnelles (MongoDB, Firebase).",
    "about.paragraph3":
      "Ma formation en Télématique me fournit une connaissance approfondie des réseaux de communication, soutenue par la certification CCNA v7 de Cisco. Je travaille avec Docker pour des déploiements efficaces et Git pour le contrôle de version. Je suis passionné par l'apprentissage continu, avec de fortes capacités de résolution de problèmes et de travail en équipe.",
    "about.downloadCV": "Télécharger CV",

    // Services
    "services.frontend": "Développement Frontend",
    "services.frontend.desc":
      "Interfaces modernes et responsives avec React, Next.js et autres technologies de pointe.",
    "services.backend": "Développement Backend",
    "services.backend.desc": "APIs robustes et efficaces avec Node.js, Express, PHP et Laravel.",
    "services.database": "Bases de Données",
    "services.database.desc": "Conception et implémentation de bases de données relationnelles et non relationnelles.",
    "services.fullstack": "Solutions Full Stack",
    "services.fullstack.desc":
      "Développement complet d'applications web avec des architectures évolutives et maintenables.",

    // Projects
    "projects.title": "Mes Projets",
    "projects.subtitle":
      "Une sélection de mes projets les plus récents et remarquables. Chaque projet reflète mon attention à la qualité, à l'expérience utilisateur et au code propre.",
    "projects.fullstack": "Full Stack",
    "projects.backend": "Backend",
    "projects.viewMore.fullstack": "Voir plus de projets Full Stack",
    "projects.viewMore.backend": "Voir plus de projets Backend",
    "projects.code": "Code",
    "projects.demo": "Démo",
    "projects.repo": "Dépôt",
    "projects.docs": "Documentation",
    "projects.viewMore": "Voir plus de projets",
    "projects.backToHome": "Retour",
    "projects.noProjects": "Aucun projet disponible pour le moment.",

    // Skills
    "skills.title": "Mes Compétences",
    "skills.subtitle":
      "Technologies et outils que j'utilise pour créer des solutions web complètes et efficaces. Mon expérience est soutenue par les projets que j'ai développés.",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.database": "Bases de Données",
    "skills.devops": "DevOps",
    "skills.other": "Autres Compétences",
    "skills.experience":
      "Les compétences présentées sont soutenues par des projets réels et une expérience pratique. Vous pouvez voir des exemples de mon travail dans la section projets.",

    // Contact
    "contact.title": "Contact",
    "contact.subtitle":
      "Vous avez un projet en tête? Parlons-en! Je suis disponible pour des projets freelance ou des postes à temps plein.",
    "contact.info": "Informations de Contact",
    "contact.email": "Email",
    "contact.phone": "Téléphone",
    "contact.location": "Emplacement",
    "contact.form.name": "Nom",
    "contact.form.email": "Email",
    "contact.form.subject": "Sujet",
    "contact.form.message": "Message",
    "contact.form.send": "Envoyer le Message",

    // Footer
    "footer.rights": "Tous droits réservés.",
    "footer.role": "Développeur Full Stack",

    // Wolf Guide
    "wolf.welcome":
      "Bonjour! Je suis Juan Villegas. Bienvenue dans mon espace virtuel où technologie et créativité se rencontrent.",
    "wolf.about":
      "Bonjour à nouveau! Je suis Juan, passionné par le développement et la technologie. Ici, vous découvrirez un peu de mon histoire.",
    "wolf.skills":
      "Regardez tout ce que je peux faire! Du backend solide à la magie full-stack, cette section met en évidence mes forces.",
    "wolf.projects":
      "Voici mes créations! Explorez mes projets full-stack et backend, conçus avec passion et précision.",
    "wolf.contact":
      "Travaillons ensemble? Écrivez-moi. Je suis à un message de distance pour transformer vos idées en réalité.",

    // Wolf Guide Short Messages
    "wolf.welcome.short": "Bonjour! Bienvenue",
    "wolf.about.short": "À propos de moi!",
    "wolf.skills.short": "Mes compétences",
    "wolf.projects.short": "Mes projets",
    "wolf.contact.short": "Contactez-moi!",

    // Experience
    "experience.title": "Expérience Professionnelle",
    "experience.subtitle": "Mon parcours professionnel et les rôles que j'ai occupés dans différentes entreprises.",
    "experience.position1": "Développeur Full Stack Senior",
    "experience.description1":
      "J'ai dirigé le développement d'applications web d'entreprise utilisant React, Node.js et MongoDB. J'ai implémenté des architectures évolutives et optimisé les performances des applications existantes.",
    "experience.position2": "Développeur Full Stack",
    "experience.description2":
      "J'ai développé et maintenu des applications web avec Vue.js et Laravel. J'ai collaboré à la migration de systèmes legacy vers des architectures modernes et participé à l'implémentation de CI/CD.",
    "experience.position3": "Développeur Web Junior",
    "experience.description3":
      "J'ai créé des sites web responsifs avec WordPress et développé des plugins personnalisés. J'ai collaboré à la conception UX/UI et optimisé les sites pour le SEO et les performances.",

    "wolf.experience":
      "Découvrez mon parcours professionnel! Vous trouverez ici mon expérience et les rôles que j'ai joués tout au long de ma carrière.",
    "wolf.experience.short": "Mon expérience!",
  },
}

// Crear el contexto
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Crear el proveedor
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(languages[0])

  // Función para obtener traducciones
  const t = (key: string): string => {
    return translations[language.code][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Hook personalizado para usar el contexto
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
