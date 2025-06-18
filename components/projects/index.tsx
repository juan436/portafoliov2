"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/use-language"
import { useContent } from "@/contexts/content"
import { ProjectsTabs } from "./projects-tabs"

export default function Projects() {
  const [activeTab, setActiveTab] = useState("fullstack")
  const { t } = useLanguage()
  const { content, isLoading } = useContent()
  const [localProjects, setLocalProjects] = useState(content.projects)
  const [translatedTexts, setTranslatedTexts] = useState({
    title: "",
    subtitle: "",
    fullstack: "",
    backend: "",
    code: "",
    demo: "",
    repo: "",
    docs: "",
    viewMore: "",
  })

  // Cargar traducciones después de la hidratación
  useEffect(() => {
    setTranslatedTexts({
      title: String(t("projects.title")),
      subtitle: String(t("projects.subtitle")),
      fullstack: String(t("projects.fullstack")),
      backend: String(t("projects.backend")),
      code: String(t("projects.code")),
      demo: String(t("projects.demo")),
      repo: String(t("projects.repo")),
      docs: String(t("projects.docs")),
      viewMore: String(t("projects.viewMore_general")),
    })
  }, [t])

  // Actualizar proyectos cuando cambia el contenido global
  useEffect(() => {
    console.log("Actualizando proyectos en componente Projects:", content.projects)
    setLocalProjects(content.projects)
  }, [content.projects])

  return (
    <section id="projects" className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{translatedTexts.title}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">{translatedTexts.subtitle}</p>
        </motion.div>

        <ProjectsTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          localProjects={localProjects}
          isLoading={isLoading}
          translatedTexts={translatedTexts}
        />
      </div>
    </section>
  )
}
