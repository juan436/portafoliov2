"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, User, Briefcase, Code, Cpu, Server, Database, Plus, Trash2, Tag } from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"

export default function ContentEditor() {
  const { content, updateHero, updateAbout, updateServices, updateExperience, updateContact, saveAllContent } =
    useContent()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("hero")
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0)

  // Estados locales para edición
  const [heroContent, setHeroContent] = useState({
    ...content.hero,
    profileImage:
      content.hero.profileImage ||
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg",
  })
  const [aboutContent, setAboutContent] = useState(content.about)
  const [servicesContent, setServicesContent] = useState(content.services)
  const [experienceContent, setExperienceContent] = useState(content.experience)
  const [contactContent, setContactContent] = useState(content.contact)

  // Estado para nueva tecnología
  const [newTechnology, setNewTechnology] = useState("")

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

  // Actualizar contenido de Hero
  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHeroContent({
      ...heroContent,
      [name]: value,
    })
  }

  // Actualizar contenido de About
  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAboutContent({
      ...aboutContent,
      [name]: value,
    })
  }

  // Actualizar servicio
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedServices = [...servicesContent]
    updatedServices[activeServiceIndex] = {
      ...updatedServices[activeServiceIndex],
      [name]: value,
    }
    setServicesContent(updatedServices)
  }

  // Actualizar experiencia
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedExperiences = [...experienceContent]
    updatedExperiences[activeExperienceIndex] = {
      ...updatedExperiences[activeExperienceIndex],
      [name]: value,
    }
    setExperienceContent(updatedExperiences)
  }

  // Agregar tecnología a la experiencia actual
  const addTechnology = () => {
    if (!newTechnology.trim()) return

    const updatedExperiences = [...experienceContent]
    const currentExperience = updatedExperiences[activeExperienceIndex]

    // Asegurarse de que skills exista
    if (!currentExperience.skills) {
      currentExperience.skills = []
    }

    // Evitar duplicados
    if (!currentExperience.skills.includes(newTechnology.trim())) {
      currentExperience.skills = [...currentExperience.skills, newTechnology.trim()]
      setExperienceContent(updatedExperiences)
      setNewTechnology("")

      toast({
        title: "Tecnología añadida",
        description: `Se ha añadido "${newTechnology}" a las tecnologías de esta experiencia.`,
        variant: "default",
      })
    } else {
      toast({
        title: "Tecnología duplicada",
        description: "Esta tecnología ya existe en la lista.",
        variant: "destructive",
      })
    }
  }

  // Eliminar tecnología de la experiencia actual
  const removeTechnology = (tech: string) => {
    const updatedExperiences = [...experienceContent]
    const currentExperience = updatedExperiences[activeExperienceIndex]

    if (currentExperience.skills) {
      currentExperience.skills = currentExperience.skills.filter((skill) => skill !== tech)
      setExperienceContent(updatedExperiences)

      toast({
        title: "Tecnología eliminada",
        description: `Se ha eliminado "${tech}" de las tecnologías de esta experiencia.`,
        variant: "default",
      })
    }
  }

  // Actualizar información de contacto
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactContent({
      ...contactContent,
      [name]: value,
    })
  }

  // Agregar nuevo servicio
  const addNewService = () => {
    const newService = {
      title: "Nuevo Servicio",
      description: "Descripción del nuevo servicio",
      icon: "Code",
    }
    const updatedServices = [...servicesContent, newService]
    setServicesContent(updatedServices)
    setActiveServiceIndex(updatedServices.length - 1)

    toast({
      title: "Servicio añadido",
      description: "Se ha añadido un nuevo servicio. Edítalo para personalizarlo.",
      variant: "default",
    })
  }

  // Eliminar servicio
  const deleteService = (index: number, e?: React.MouseEvent) => {
    // Evitar la propagación del evento si existe
    if (e) {
      e.stopPropagation()
    }

    if (servicesContent.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos un servicio.",
        variant: "destructive",
      })
      return
    }

    const updatedServices = [...servicesContent]
    updatedServices.splice(index, 1)
    setServicesContent(updatedServices)

    // Ajustar el índice activo si es necesario
    if (activeServiceIndex >= updatedServices.length) {
      setActiveServiceIndex(updatedServices.length - 1)
    }

    toast({
      title: "Servicio eliminado",
      description: "El servicio ha sido eliminado correctamente.",
      variant: "default",
    })
  }

  // Agregar nueva experiencia
  const addNewExperience = () => {
    const newExperience = {
      position: "Nuevo Cargo",
      company: "Nueva Empresa",
      period: "2023 - Presente",
      description: "Descripción de la nueva experiencia laboral",
      skills: ["Git", "JavaScript", "HTML", "CSS"], // Tecnologías por defecto
    }
    const updatedExperiences = [...experienceContent, newExperience]
    setExperienceContent(updatedExperiences)
    setActiveExperienceIndex(updatedExperiences.length - 1)

    toast({
      title: "Experiencia añadida",
      description: "Se ha añadido una nueva experiencia. Edítala para personalizarla.",
      variant: "default",
    })
  }

  // Eliminar experiencia
  const deleteExperience = (index: number, e?: React.MouseEvent) => {
    // Evitar la propagación del evento si existe
    if (e) {
      e.stopPropagation()
    }

    if (experienceContent.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos una experiencia.",
        variant: "destructive",
      })
      return
    }

    const updatedExperiences = [...experienceContent]
    updatedExperiences.splice(index, 1)
    setExperienceContent(updatedExperiences)

    // Ajustar el índice activo si es necesario
    if (activeExperienceIndex >= updatedExperiences.length) {
      setActiveExperienceIndex(updatedExperiences.length - 1)
    }

    toast({
      title: "Experiencia eliminada",
      description: "La experiencia ha sido eliminada correctamente.",
      variant: "default",
    })
  }

  // Modificar la función handleSave para asegurar que los cambios se reflejen correctamente
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

  // Añadir el componente de notificación al final del componente, justo antes del return final
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
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

        {/* Sección Hero */}
        <TabsContent value="hero" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Sección Hero</CardTitle>
              <CardDescription>
                Edita el contenido principal que se muestra en la parte superior de tu portafolio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={heroContent.title}
                  onChange={handleHeroChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={heroContent.subtitle}
                  onChange={handleHeroChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={heroContent.description}
                  onChange={handleHeroChange}
                  className="min-h-[100px] bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileImage">Imagen de Perfil (URL)</Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  value={heroContent.profileImage}
                  onChange={handleHeroChange}
                  className="bg-black/40 border-blue-700/20"
                  placeholder="https://tu-dominio.com/images/profile/tu-imagen.jpg"
                />
                <p className="text-xs text-slate-400">
                  URL de la imagen de perfil que se mostrará en las secciones Hero y About.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección About */}
        <TabsContent value="about" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Sección Sobre Mí</CardTitle>
              <CardDescription>
                Edita la información personal y profesional que aparece en la sección "Sobre Mí".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paragraph1">Párrafo 1</Label>
                <Textarea
                  id="paragraph1"
                  name="paragraph1"
                  value={aboutContent.paragraph1}
                  onChange={handleAboutChange}
                  className="min-h-[100px] bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paragraph2">Párrafo 2</Label>
                <Textarea
                  id="paragraph2"
                  name="paragraph2"
                  value={aboutContent.paragraph2}
                  onChange={handleAboutChange}
                  className="min-h-[100px] bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paragraph3">Párrafo 3</Label>
                <Textarea
                  id="paragraph3"
                  name="paragraph3"
                  value={aboutContent.paragraph3}
                  onChange={handleAboutChange}
                  className="min-h-[100px] bg-black/40 border-blue-700/20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección Servicios */}
        <TabsContent value="services" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sección Servicios</CardTitle>
                <CardDescription>Edita los servicios que ofreces y que se muestran en tu portafolio.</CardDescription>
              </div>
              <Button onClick={addNewService} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Nuevo Servicio
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {servicesContent.map((service, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 relative ${
                      activeServiceIndex === index
                        ? "bg-blue-900/20 border-blue-500"
                        : "bg-black/40 border-blue-700/20 hover:border-blue-700/50"
                    }`}
                    onClick={() => setActiveServiceIndex(index)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="mb-2 mt-2">
                          {service.icon === "Code" && <Code className="h-6 w-6 mx-auto text-blue-500" />}
                          {service.icon === "Server" && <Server className="h-6 w-6 mx-auto text-blue-500" />}
                          {service.icon === "Database" && <Database className="h-6 w-6 mx-auto text-blue-500" />}
                          {service.icon === "Cpu" && <Cpu className="h-6 w-6 mx-auto text-blue-500" />}
                        </div>
                        <h3 className="font-medium text-sm mb-1">{service.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteService(index, e)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4 border border-blue-700/20 rounded-lg p-4">
                <h3 className="font-medium mb-2">Editando: {servicesContent[activeServiceIndex].title}</h3>
                <div className="space-y-2">
                  <Label htmlFor="service-title">Título del Servicio</Label>
                  <Input
                    id="service-title"
                    name="title"
                    value={servicesContent[activeServiceIndex].title}
                    onChange={handleServiceChange}
                    className="bg-black/40 border-blue-700/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-description">Descripción</Label>
                  <Textarea
                    id="service-description"
                    name="description"
                    value={servicesContent[activeServiceIndex].description}
                    onChange={handleServiceChange}
                    className="min-h-[100px] bg-black/40 border-blue-700/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-icon">Icono</Label>
                  <select
                    id="service-icon"
                    name="icon"
                    value={servicesContent[activeServiceIndex].icon}
                    onChange={handleServiceChange}
                    className="w-full p-2 rounded-md bg-black/40 border border-blue-700/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Code">Code</option>
                    <option value="Server">Server</option>
                    <option value="Database">Database</option>
                    <option value="Cpu">Cpu</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección Experiencia */}
        <TabsContent value="experience" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sección Experiencia</CardTitle>
                <CardDescription>Edita tu experiencia laboral que se muestra en tu portafolio.</CardDescription>
              </div>
              <Button onClick={addNewExperience} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Nueva Experiencia
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {experienceContent.map((exp, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 relative ${
                      activeExperienceIndex === index
                        ? "bg-blue-900/20 border-blue-500"
                        : "bg-black/40 border-blue-700/20 hover:border-blue-700/50"
                    }`}
                    onClick={() => setActiveExperienceIndex(index)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-medium text-sm mb-1">{exp.position}</h3>
                        <p className="text-xs text-slate-400">{exp.company}</p>
                        <p className="text-xs text-slate-500 mt-1">{exp.period}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteExperience(index, e)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4 border border-blue-700/20 rounded-lg p-4">
                <h3 className="font-medium mb-2">Editando: {experienceContent[activeExperienceIndex].position}</h3>
                <div className="space-y-2">
                  <Label htmlFor="exp-position">Cargo</Label>
                  <Input
                    id="exp-position"
                    name="position"
                    value={experienceContent[activeExperienceIndex].position}
                    onChange={handleExperienceChange}
                    className="bg-black/40 border-blue-700/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-company">Empresa</Label>
                  <Input
                    id="exp-company"
                    name="company"
                    value={experienceContent[activeExperienceIndex].company}
                    onChange={handleExperienceChange}
                    className="bg-black/40 border-blue-700/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-period">Período</Label>
                  <Input
                    id="exp-period"
                    name="period"
                    value={experienceContent[activeExperienceIndex].period}
                    onChange={handleExperienceChange}
                    className="bg-black/40 border-blue-700/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-description">Descripción</Label>
                  <Textarea
                    id="exp-description"
                    name="description"
                    value={experienceContent[activeExperienceIndex].description}
                    onChange={handleExperienceChange}
                    className="min-h-[100px] bg-black/40 border-blue-700/20"
                  />
                </div>

                {/* Nueva sección para tecnologías */}
                <div className="space-y-2 mt-6 pt-6 border-t border-blue-700/20">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="exp-technologies" className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-blue-500" />
                      Tecnologías Utilizadas
                    </Label>
                  </div>

                  {/* Lista de tecnologías actuales */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experienceContent[activeExperienceIndex].skills?.map((tech, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 group"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(tech)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {!experienceContent[activeExperienceIndex].skills?.length && (
                      <p className="text-sm text-slate-500 italic">No hay tecnologías añadidas</p>
                    )}
                  </div>

                  {/* Formulario para añadir nueva tecnología */}
                  <div className="flex gap-2">
                    <Input
                      id="new-technology"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Añadir nueva tecnología..."
                      className="bg-black/40 border-blue-700/20 flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTechnology()
                        }
                      }}
                    />
                    <Button
                      onClick={addTechnology}
                      className="bg-blue-700 hover:bg-blue-800"
                      disabled={!newTechnology.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir
                    </Button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Presiona Enter o haz clic en "Añadir" para agregar una nueva tecnología. Las tecnologías aparecerán
                    como badges en la sección de experiencia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sección Contacto */}
        <TabsContent value="contact" className="mt-0">
          <Card className="bg-black/40 border-blue-700/20">
            <CardHeader>
              <CardTitle>Sección Contacto</CardTitle>
              <CardDescription>Edita tu información de contacto que se muestra en tu portafolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={contactContent.email}
                  onChange={handleContactChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={contactContent.phone}
                  onChange={handleContactChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={contactContent.location}
                  onChange={handleContactChange}
                  className="bg-black/40 border-blue-700/20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
