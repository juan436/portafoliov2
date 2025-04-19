"use client"

import { motion } from "framer-motion"
import { Code2, Database, Server, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useContent } from "@/contexts/content-context"
import { useEffect, useState } from "react"

export default function About() {
  const { t } = useLanguage()
  const { content } = useContent()
  // Usamos el estado local para manejar el contenido actualizado
  const [localContent, setLocalContent] = useState(content)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.1 * index },
    }),
  }

  // Mapear los iconos a los componentes correspondientes
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code2 className="h-10 w-10 text-blue-500" />
      case "Server":
        return <Server className="h-10 w-10 text-blue-500" />
      case "Database":
        return <Database className="h-10 w-10 text-blue-500" />
      case "Cpu":
        return <Cpu className="h-10 w-10 text-blue-500" />
      default:
        return <Code2 className="h-10 w-10 text-blue-500" />
    }
  }

  // Actualizar el estado local cuando cambia el contenido global
  useEffect(() => {
    setLocalContent(content)
  }, [content])

  // Escuchar el evento contentUpdated para actualizar el componente
  useEffect(() => {
    const handleContentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail) {
        console.log("Content updated event received:", customEvent.detail)
        // Actualizar todo el contenido local con los datos del evento
        setLocalContent((prev) => ({
          ...prev,
          ...customEvent.detail,
        }))
      }
    }

    // Añadir el event listener
    window.addEventListener("contentUpdated", handleContentUpdate)

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("contentUpdated", handleContentUpdate)
    }
  }, [])

  // Forzar la actualización del componente cuando cambia el contenido
  useEffect(() => {
    console.log("About component content updated:", localContent)
  }, [localContent])

  return (
    <section id="about" className="py-20 bg-black/50 relative">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("about.title")}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex justify-center items-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/20 to-transparent rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-blue-700/20 to-transparent rounded-lg transform -rotate-3"></div>
              <motion.div
                className="relative bg-black/40 border border-blue-700/30 rounded-lg p-6"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                  borderColor: "rgba(59, 130, 246, 0.6)",
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="aspect-[4/5] relative overflow-hidden rounded-lg mb-6"
                  whileHover={{
                    filter: "brightness(1.1)",
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.4 },
                    }}
                  >
                    <Image
                      src={
                        localContent.hero.profileImage ||
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="Juan Villegas"
                      width={400}
                      height={500}
                      className="object-cover object-top transition-all duration-300"
                    />
                  </motion.div>
                </motion.div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">{t("hero.title")}</h3>
                  <p className="text-blue-500">{t("about.role")}</p>
                  <p className="text-sm text-slate-400">
                    {t("about.engineer")}
                    <br />
                    {t("about.university")}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-7 flex flex-col justify-center"
          >
            <div className="space-y-6 text-slate-300">
              {/* Usar localContent en lugar de content para mostrar los párrafos */}
              <p className="leading-relaxed">{localContent.about.paragraph1}</p>
              <p className="leading-relaxed">{localContent.about.paragraph2}</p>
              <p className="leading-relaxed">{localContent.about.paragraph3}</p>

              <div className="pt-4">
                <a href="#" className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors">
                  <span className="mr-2">{t("about.downloadCV")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localContent.services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="bg-black/40 border-blue-700/20 hover:border-blue-700/50 transition-all duration-300 h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-blue-700/10">{getServiceIcon(service.icon)}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-slate-400">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
