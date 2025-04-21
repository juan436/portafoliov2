"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Code2, Server, Database, Terminal, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useContent } from "@/contexts/content-context"
import type { Project } from "@/contexts/content-context"
import LanguageSwitcher from "@/components/language-switcher"
import Footer from "@/components/footer"

export default function ProjectsPage() {
  const { t } = useLanguage()
  const { content } = useContent()
  const [activeTab, setActiveTab] = useState("fullstack")
  const [projects, setProjects] = useState({
    fullstack: content.projects.fullstack || [],
    backend: content.projects.backend || [],
  })
  const [isLoading, setIsLoading] = useState(true)

  // Cargar proyectos desde el contexto
  useEffect(() => {
    console.log("Cargando proyectos desde el contexto:", content.projects)
    setProjects({
      fullstack: content.projects.fullstack || [],
      backend: content.projects.backend || [],
    })
    setIsLoading(false)
  }, [content.projects])

  // Usar el parámetro de consulta para determinar la pestaña activa
  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      if (tabParam && (tabParam === "fullstack" || tabParam === "backend")) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Simplified Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="bg-transparent border-0 cursor-pointer" aria-label="Home">
              <svg
                width="80"
                height="48"
                viewBox="0 0 50 30"
                className="hover:scale-105 transition-transform duration-300"
              >
                {/* Background shape */}
                <rect
                  x="1"
                  y="1"
                  width="48"
                  height="28"
                  rx="6"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                />

                {/* J letter */}
                <path
                  d="M12 7v10c0 2-1 3-3 3s-3-1-3-3"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* V letter */}
                <path
                  d="M18 7l4 13 4-13"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Underscore and DEV */}
                <path d="M30 17h12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
                <text x="30" y="13" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#e2e8f0">
                  DEV
                </text>

                {/* Tech circuit lines */}
                <path d="M3 15h2 M45 15h2" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
                <circle cx="5" cy="15" r="1" fill="#3b82f6" />
                <circle cx="45" cy="15" r="1" fill="#3b82f6" />
              </svg>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-20 mt-16 flex-grow">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("projects.backToHome")}
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("projects.title")}</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("projects.subtitle")}</p>
        </motion.div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            ) : projects.fullstack.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.fullstack
                  .sort((a, b) => b.id - a.id) // Ordenar por ID descendente
                  .map((project, index) => (
                    <FullStackProjectCard key={project.id} project={project} index={index} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">{t("projects.noProjects")}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="backend" className="mt-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-slate-400">Cargando proyectos...</p>
              </div>
            ) : projects.backend.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.backend
                  .sort((a, b) => b.id - a.id) // Ordenar por ID descendente
                  .map((project, index) => (
                    <BackendProjectCard key={project.id} project={project} index={index} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">{t("projects.noProjects")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

function FullStackProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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

function BackendProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
