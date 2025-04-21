"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github, Code2, Server, Database, Terminal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useContent } from "@/contexts/content-context"
import type { Project } from "@/contexts/content-context"

export default function Projects() {
  const [activeTab, setActiveTab] = useState("fullstack")
  const { t } = useLanguage()
  const { content, isLoading } = useContent()
  const [localProjects, setLocalProjects] = useState(content.projects)

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("projects.title")}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("projects.subtitle")}</p>
        </motion.div>

        <Tabs defaultValue="fullstack" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-12">
            <TabsList className="bg-black/40 border border-blue-700/20">
              <TabsTrigger
                value="fullstack"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
              >
                <Code2 className="mr-2 h-4 w-4" />
                {t("projects.fullstack")}
              </TabsTrigger>
              <TabsTrigger
                value="backend"
                className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
              >
                <Server className="mr-2 h-4 w-4" />
                {t("projects.backend")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="fullstack" className="mt-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-slate-400">Cargando proyectos...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {localProjects.fullstack
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 3)
                    .map((project, index) => (
                      <FullStackProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mt-12 flex justify-center"
                >
                  <Link href={`/projects?tab=${activeTab}`} className="group">
                    <Button
                      variant="outline"
                      className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10 group-hover:border-blue-500 transition-all duration-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("projects.viewMore")}
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </TabsContent>

          <TabsContent value="backend" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {localProjects.backend
                .sort((a, b) => b.id - a.id)
                .slice(0, 3)
                .map((project, index) => (
                  <BackendProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center"
            >
              <Link href={`/projects?tab=${activeTab}`} className="group">
                <Button
                  variant="outline"
                  className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10 group-hover:border-blue-500 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("projects.viewMore")}
                </Button>
              </Link>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

// Componente para mostrar proyectos Full Stack
function FullStackProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg?height=400&width=600"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-semibold text-white drop-shadow-md">{project.title}</h3>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-slate-400 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-blue-700/10 text-blue-400 border border-blue-700/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {t("projects.code")}
              </a>
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("projects.demo")}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Componente para mostrar proyectos Backend
function BackendProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            {project.id % 3 === 0 ? (
              <Server className="h-8 w-8 text-blue-500 mr-3" />
            ) : project.id % 3 === 1 ? (
              <Database className="h-8 w-8 text-blue-500 mr-3" />
            ) : (
              <Terminal className="h-8 w-8 text-blue-500 mr-3" />
            )}
            <h3 className="text-xl font-semibold">{project.title}</h3>
          </div>

          <p className="text-slate-400 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-blue-700/10 text-blue-400 border border-blue-700/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mt-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {t("projects.repo")}
              </a>
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("projects.docs")}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
