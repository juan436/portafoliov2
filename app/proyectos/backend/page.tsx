"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Github, Server, Database, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import LanguageSwitcher from "@/components/language-switcher"

export default function BackendProjects() {
  const [backendProjects, setBackendProjects] = useState([])

  useEffect(() => {
    // Cargar proyectos desde localStorage
    const loadProjects = () => {
      try {
        const savedContent = localStorage.getItem("portfolioContent")
        if (savedContent) {
          const parsedContent = JSON.parse(savedContent)
          setBackendProjects(parsedContent.projects.backend || [])
        }
      } catch (error) {
        console.error("Error loading projects from localStorage:", error)
      }
    }

    loadProjects()

    // Escuchar actualizaciones de contenido
    const handleContentUpdated = () => {
      loadProjects()
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadProjects()
    }

    window.addEventListener("contentUpdated", handleContentUpdated)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("contentUpdated", handleContentUpdated)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Función para obtener el icono según el ID del proyecto
  const getIconForProject = (projectId) => {
    if (projectId % 3 === 0) {
      return <Server className="h-8 w-8 text-blue-500 mr-3" />
    } else if (projectId % 3 === 1) {
      return <Database className="h-8 w-8 text-blue-500 mr-3" />
    } else {
      return <Terminal className="h-8 w-8 text-blue-500 mr-3" />
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header simplificado */}
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
            <LanguageSwitcher />
          </div>
        </nav>
      </header>

      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-20" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-20" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center mb-8">
            <Button
              asChild
              variant="ghost"
              className="mr-4 text-blue-500 hover:text-blue-400 hover:bg-blue-900/20 -ml-4"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Proyectos Backend</h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explora mi colección completa de proyectos Backend, donde desarrollo APIs, microservicios y sistemas de
              servidor robustos y escalables.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {backendProjects.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-400">No hay proyectos disponibles en este momento.</p>
              </div>
            ) : (
              [...backendProjects]
                .sort((a, b) => b.id - a.id)
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {getIconForProject(project.id)}
                          <h3 className="text-xl font-semibold">{project.title}</h3>
                        </div>

                        <p className="text-slate-400 mb-6">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag) => (
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
                              Repositorio
                            </a>
                          </Button>
                          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Documentación
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
