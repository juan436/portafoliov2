"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { User, FileText, Code, Cpu, Save } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import Script from "next/script"

// Importar componentes extraídos
import HeroForm, { HeroContent } from "@/components/admin/forms/hero-form"
import AboutForm, { AboutContent } from "@/components/admin/forms/about-form"
import ServicesForm, { Service } from "@/components/admin/forms/services-form"
import ContactForm, { ContactContent } from "@/components/admin/forms/contact-form"

export default function ContentEditor() {
  const { content, updateHero, updateAbout, updateServices, updateContact, saveAllContent } =
    useContent()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("hero")
  const [isLoading, setIsLoading] = useState(false)

  // Estados locales para edición
  const [heroContent, setHeroContent] = useState<HeroContent>({
    ...content.hero,
    profileImage:
      content.hero.profileImage ||
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  })
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    paragraph1: content.about.paragraph1 || "",
    paragraph2: content.about.paragraph2 || "",
    paragraph3: content.about.paragraph3 || "",
  })
  const [servicesContent, setServicesContent] = useState<Service[]>(content.services || [])
  const [contactContent, setContactContent] = useState<ContactContent>(content.contact)

  // Actualizar estados locales cuando cambia el contenido global
  useEffect(() => {
    // Evitar actualizaciones innecesarias que causan parpadeo
    if (isLoading) return;

    console.log("ContentEditor useEffect [content, isLoading]", {
      isLoading,
      contentAbout: content.about,
      localAbout: aboutContent
    });

    setHeroContent({
      ...content.hero,
      profileImage:
        content.hero.profileImage ||
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
    })
    setAboutContent({
      paragraph1: content.about.paragraph1 || "",
      paragraph2: content.about.paragraph2 || "",
      paragraph3: content.about.paragraph3 || "",
    })
    setServicesContent(content.services || [])
    setContactContent(content.contact)
  }, [content, isLoading])

  // Función para guardar todos los cambios
  const handleSave = async () => {
    try {
      setIsLoading(true)

      console.log("ContentEditor handleSave - antes de actualizar", {
        aboutContent,
        contentAbout: content.about
      });

      // Primero actualizar el contexto global con los estados locales
      updateHero(heroContent)
      updateAbout(aboutContent)
      updateServices(servicesContent)
      updateContact(contactContent)

      // Luego guardar todo en localStorage y disparar el evento
      const success = saveAllContent()

      console.log("ContentEditor handleSave - después de actualizar", {
        success,
        aboutContent,
        contentAbout: content.about
      });

      if (success) {
        toast({
          title: "Cambios guardados",
          description: "El contenido ha sido actualizado correctamente.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error al guardar",
          description: "Ha ocurrido un error al guardar los cambios.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar el contenido:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado al guardar los cambios.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Editor de Contenido</h2>
          <Button
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
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

          <TabsContent value="contact" className="mt-0">
            <ContactForm content={contactContent} onChange={setContactContent} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  )
}
