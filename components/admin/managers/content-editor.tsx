"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { User, FileText, Code, Briefcase, Cpu } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import Script from "next/script"

// Importar componentes extraídos
import HeroForm, { HeroContent } from "@/components/admin/forms/hero-form"
import AboutForm, { AboutContent } from "@/components/admin/forms/about-form"
import ServicesForm, { Service } from "@/components/admin/forms/services-form"
import ExperienceForm, { Experience } from "@/components/admin/forms/experience-form"
import ContactForm, { ContactContent } from "@/components/admin/forms/contact-form"

export default function ContentEditor() {
  const { content, updateHero, updateAbout, updateServices, updateExperience, updateContact, saveAllContent } =
    useContent()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("hero")

  // Estados locales para edición
  const [heroContent, setHeroContent] = useState<HeroContent>({
    ...content.hero,
    profileImage:
      content.hero.profileImage ||
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  })
  const [aboutContent, setAboutContent] = useState<AboutContent>(content.about)
  const [servicesContent, setServicesContent] = useState<Service[]>(content.services)
  const [experienceContent, setExperienceContent] = useState<Experience[]>(content.experience)
  const [contactContent, setContactContent] = useState<ContactContent>(content.contact)

  // Añadir un estado para controlar la notificación de guardado
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const saveNotificationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Actualizar estados locales cuando cambia el contenido global
  useEffect(() => {
    setHeroContent(content.hero)
    setAboutContent(content.about)
    setServicesContent(content.services)
    setExperienceContent(content.experience)
    setContactContent(content.contact)
  }, [content])

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (saveNotificationTimeout.current) {
        clearTimeout(saveNotificationTimeout.current)
      }
    }
  }, [])

  // Función para guardar todos los cambios
  const handleSave = () => {
    // Primero actualizar el contexto global con los estados locales
    updateHero(heroContent)
    updateAbout(aboutContent)
    updateServices(servicesContent)
    updateExperience(experienceContent)
    updateContact(contactContent)

    // Luego guardar todo en localStorage y disparar el evento
    const success = saveAllContent()

    if (success) {
      // Mostrar la notificación
      setShowSaveNotification(true)

      // Mostrar el toast normal
      toast({
        title: "Cambios guardados",
        description: "El contenido ha sido actualizado correctamente.",
        variant: "default",
      })

      // Ocultar la notificación después de 3 segundos
      if (saveNotificationTimeout.current) {
        clearTimeout(saveNotificationTimeout.current)
      }
      saveNotificationTimeout.current = setTimeout(() => {
        setShowSaveNotification(false)
      }, 3000)
    } else {
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar los cambios.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Script para cargar los iconos de Devicon (necesario para las habilidades) */}
      <Script src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.js" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Notificación de guardado exitoso */}
        <AnimatePresence>
          {showSaveNotification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">¡Cambios guardados exitosamente!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Editor de Contenido</h2>
          <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
            Guardar Cambios
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 border border-blue-700/20 mb-6">
            <TabsTrigger value="hero" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
              <User className="mr-2 h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
              <FileText className="mr-2 h-4 w-4" />
              Sobre Mí
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
            >
              <Code className="mr-2 h-4 w-4" />
              Servicios
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Experiencia
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
              <Cpu className="mr-2 h-4 w-4" />
              Contacto
            </TabsTrigger>
          </TabsList>

          {/* Contenido de las tabs usando los componentes refactorizados */}
          <TabsContent value="hero" className="mt-0">
            <HeroForm content={heroContent} onChange={setHeroContent} />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <AboutForm content={aboutContent} onChange={setAboutContent} />
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <ServicesForm services={servicesContent} onChange={setServicesContent} />
          </TabsContent>

          <TabsContent value="experience" className="mt-0">
            <ExperienceForm experiences={experienceContent} onChange={setExperienceContent} />
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <ContactForm content={contactContent} onChange={setContactContent} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  )
}
