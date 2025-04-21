"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useContent } from "@/contexts/content-context"
import Script from "next/script"


export default function Skills() {
  const { t } = useLanguage()
  const { content } = useContent()
  const [activeTab, setActiveTab] = useState("frontend")
  const [skills, setSkills] = useState(content.skills)
  const [otherSkills, setOtherSkills] = useState(content.otherSkills)
  const [skillsData, setSkillsData] = useState(content.skills)

  // Actualizar cuando cambia el contenido global
  useEffect(() => {
    setSkills(content.skills)
    setOtherSkills(content.otherSkills)
  }, [content])

  // Mejorar la escucha de eventos para actualizar correctamente el componente
  useEffect(() => {
    const handleContentUpdated = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail) {
        // Actualizar solo si hay cambios en las habilidades
        if (customEvent.detail.skills) {
          setSkills(customEvent.detail.skills)
        }
        if (customEvent.detail.otherSkills) {
          setOtherSkills(customEvent.detail.otherSkills)
        }
      }
    }

    window.addEventListener("contentUpdated", handleContentUpdated)
    return () => {
      window.removeEventListener("contentUpdated", handleContentUpdated)
    }
  }, [])

  // Añadir un efecto para escuchar el evento skillsUpdated
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.skills) {
        setSkillsData(event.detail.skills)
      }
    }

    const handleSkillsUpdate = (event: CustomEvent) => {
      if (event.detail) {
        setSkillsData(event.detail)
      }
    }

    // Escuchar eventos de actualización de contenido y habilidades específicamente
    window.addEventListener("contentUpdated", handleContentUpdate as EventListener)
    window.addEventListener("skillsUpdated", handleSkillsUpdate as EventListener)

    return () => {
      window.removeEventListener("contentUpdated", handleContentUpdate as EventListener)
      window.removeEventListener("skillsUpdated", handleSkillsUpdate as EventListener)
    }
  }, [])

  // Renderizar el icono de Devicon
  const renderDevIcon = (skill: { name: string; icon: string; colored?: boolean }) => {
    if (!skill.icon) return null

    // Caso especial para Next.js
    if (skill.icon === "nextjs") {
      return (
        <i
          className={`devicon-nextjs-original-wordmark${skill.colored !== false ? " colored" : ""}`}
          style={skill.colored === false ? { color: "white" } : {}}
        ></i>
      )
    }

    // Casos especiales que usan sufijos diferentes
    const specialIcons: Record<string, string> = {
      express: "original",
      nestjs: "plain-wordmark",
      amazonwebservices: "original",
      digitalocean: "original",
    }

    // Determinar el sufijo correcto
    const suffix = specialIcons[skill.icon] || "plain"
    const iconClass = `devicon-${skill.icon}-${suffix}${skill.colored !== false ? " colored" : ""}`

    return <i className={iconClass} style={skill.colored === false ? { color: "white" } : {}}></i>
  }

  return (
    <section id="skills" className="py-20 bg-black/50 relative">
      {/* Cargar el script de Devicon */}
      <Script src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("skills.title")}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("skills.subtitle")}</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-black/40 border border-blue-700/20">
              <TabsTrigger
                value="frontend"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
              >
                Frontend
              </TabsTrigger>
              <TabsTrigger
                value="backend"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
              >
                Backend
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
              >
                Database
              </TabsTrigger>
              <TabsTrigger
                value="devops"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
              >
                DevOps
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="frontend" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.frontend.map((skill) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-4xl mb-3">{renderDevIcon(skill)}</div>
                      <h3 className="text-sm font-medium">{skill.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="backend" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.backend.map((skill) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-4xl mb-3">{renderDevIcon(skill)}</div>
                      <h3 className="text-sm font-medium">{skill.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="database" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.database.map((skill) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-4xl mb-3">{renderDevIcon(skill)}</div>
                      <h3 className="text-sm font-medium">{skill.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="devops" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.devops.map((skill) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-4xl mb-3">{renderDevIcon(skill)}</div>
                      <h3 className="text-sm font-medium">{skill.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">{t("skills.other")}</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {otherSkills.map((skill, index) => (
              <motion.span
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-3 py-1 bg-blue-700/20 text-blue-400 rounded-full text-sm border border-blue-700/30 hover:bg-blue-700/30 transition-colors"
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
