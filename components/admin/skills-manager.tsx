"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Pencil,
  Trash2,
  Code,
  Server,
  Database,
  Braces,
  ExternalLink,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Palette,
  Check,
} from "lucide-react"
import { useContent } from "@/contexts/content-context"
import { useToast } from "@/hooks/use-toast"
import type { Skill } from "@/contexts/content-context"
import Script from "next/script"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

// Lista ampliada de iconos de Devicon
const deviconOptions = [
  // Frontend
  { value: "react", label: "React", category: "frontend" },
  { value: "nextjs", label: "Next.js", category: "frontend" },
  { value: "typescript", label: "TypeScript", category: "frontend" },
  { value: "javascript", label: "JavaScript", category: "frontend" },
  { value: "html5", label: "HTML5", category: "frontend" },
  { value: "css3", label: "CSS3", category: "frontend" },
  { value: "tailwindcss", label: "Tailwind CSS", category: "frontend" },
  { value: "bootstrap", label: "Bootstrap", category: "frontend" },
  { value: "sass", label: "Sass", category: "frontend" },
  { value: "vuejs", label: "Vue.js", category: "frontend" },
  { value: "angular", label: "Angular", category: "frontend" },
  { value: "redux", label: "Redux", category: "frontend" },
  { value: "webpack", label: "Webpack", category: "frontend" },
  { value: "babel", label: "Babel", category: "frontend" },
  { value: "jquery", label: "jQuery", category: "frontend" },

  // Backend
  { value: "nodejs", label: "Node.js", category: "backend" },
  { value: "express", label: "Express", category: "backend" },
  { value: "php", label: "PHP", category: "backend" },
  { value: "laravel", label: "Laravel", category: "backend" },
  { value: "python", label: "Python", category: "backend" },
  { value: "django", label: "Django", category: "backend" },
  { value: "flask", label: "Flask", category: "backend" },
  { value: "ruby", label: "Ruby", category: "backend" },
  { value: "rails", label: "Rails", category: "backend" },
  { value: "java", label: "Java", category: "backend" },
  { value: "spring", label: "Spring", category: "backend" },
  { value: "csharp", label: "C#", category: "backend" },
  { value: "dotnetcore", label: ".NET Core", category: "backend" },
  { value: "go", label: "Go", category: "backend" },
  { value: "rust", label: "Rust", category: "backend" },
  { value: "graphql", label: "GraphQL", category: "backend" },

  // Database
  { value: "mongodb", label: "MongoDB", category: "database" },
  { value: "mysql", label: "MySQL", category: "database" },
  { value: "postgresql", label: "PostgreSQL", category: "database" },
  { value: "sqlite", label: "SQLite", category: "database" },
  { value: "firebase", label: "Firebase", category: "database" },
  { value: "redis", label: "Redis", category: "database" },
  { value: "sequelize", label: "Sequelize", category: "database" },
  { value: "prisma", label: "Prisma", category: "database" },
  { value: "oracle", label: "Oracle", category: "database" },
  { value: "microsoftsqlserver", label: "SQL Server", category: "database" },
  { value: "dynamodb", label: "DynamoDB", category: "database" },

  // DevOps
  { value: "git", label: "Git", category: "devops" },
  { value: "github", label: "GitHub", category: "devops" },
  { value: "gitlab", label: "GitLab", category: "devops" },
  { value: "docker", label: "Docker", category: "devops" },
  { value: "kubernetes", label: "Kubernetes", category: "devops" },
  { value: "jenkins", label: "Jenkins", category: "devops" },
  { value: "amazonwebservices", label: "AWS", category: "devops" },
  { value: "googlecloud", label: "Google Cloud", category: "devops" },
  { value: "azure", label: "Azure", category: "devops" },
  { value: "vercel", label: "Vercel", category: "devops" },
  { value: "netlify", label: "Netlify", category: "devops" },
  { value: "heroku", label: "Heroku", category: "devops" },
  { value: "nginx", label: "Nginx", category: "devops" },
  { value: "apache", label: "Apache", category: "devops" },
  { value: "linux", label: "Linux", category: "devops" },
  { value: "bash", label: "Bash", category: "devops" },
]

export default function SkillsManager() {
  const { content, updateSkills, updateOtherSkills, saveAllContent } = useContent()
  const { toast } = useToast()
  const [skills, setSkills] = useState(content.skills)
  const [otherSkills, setOtherSkills] = useState(content.otherSkills)
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null)
  const [currentOtherSkill, setCurrentOtherSkill] = useState("")
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [isOtherSkillDialogOpen, setIsOtherSkillDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteOtherSkillDialogOpen, setIsDeleteOtherSkillDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("frontend")
  const [selectedIcon, setSelectedIcon] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showIconGrid, setShowIconGrid] = useState(false)
  const [filteredIcons, setFilteredIcons] = useState(deviconOptions)
  const [useColoredIcons, setUseColoredIcons] = useState(true)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filtrar iconos basados en el término de búsqueda y la categoría activa
  useEffect(() => {
    let filtered = deviconOptions

    // Filtrar por categoría si no estamos mostrando la cuadrícula completa
    if (!showIconGrid) {
      filtered = filtered.filter((icon) => icon.category === activeTab)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (icon) =>
          icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.value.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredIcons(filtered)
  }, [searchTerm, activeTab, showIconGrid])

  // Actualizar skills locales cuando cambia el contenido global
  useEffect(() => {
    setSkills(content.skills)
    setOtherSkills(content.otherSkills)
  }, [content.skills, content.otherSkills])

  // Enfocar el campo de búsqueda cuando se abre el selector de iconos
  useEffect(() => {
    if (showIconPicker && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [showIconPicker])

  // Modificar la función renderDevIcon para manejar específicamente el caso de Next.js
  const renderDevIcon = (iconName: string) => {
    if (!iconName) return null

    // Caso especial para Next.js
    if (iconName === "nextjs") {
      return (
        <i
          className={`devicon-nextjs-original-wordmark ${useColoredIcons ? "colored" : ""}`}
          style={{ fontSize: "2rem" }}
        ></i>
      )
    }

    // Para el resto de iconos, usar el formato estándar de Devicon
    const colorClass = useColoredIcons ? "colored" : ""
    return <i className={`devicon-${iconName}-plain ${colorClass}`} style={{ fontSize: "2rem" }}></i>
  }

  // Crear una nueva skill
  const handleCreateSkill = () => {
    setCurrentSkill({
      name: "",
      icon: "",
    })
    setSelectedIcon("")
    setIsSkillDialogOpen(true)
  }

  // Editar una skill existente
  const handleEditSkill = (skill: Skill) => {
    setCurrentSkill({ ...skill })
    setSelectedIcon(skill.icon)
    setIsSkillDialogOpen(true)
  }

  // Confirmar eliminación de una skill
  const handleDeleteConfirm = (skill: Skill) => {
    setCurrentSkill(skill)
    setIsDeleteDialogOpen(true)
  }

  // Eliminar una skill
  const handleDeleteSkill = () => {
    if (currentSkill) {
      const updatedSkills = {
        ...skills,
        [activeTab]: skills[activeTab as keyof typeof skills].filter((s) => s.name !== currentSkill.name),
      }
      setSkills(updatedSkills)
      updateSkills(updatedSkills)
      saveAllContent()
      setIsDeleteDialogOpen(false)
      setCurrentSkill(null)

      toast({
        title: "Habilidad eliminada",
        description: "La habilidad ha sido eliminada correctamente.",
        variant: "default",
      })
    }
  }

  // Guardar una skill (nueva o editada)
  const handleSaveSkill = (formData: FormData) => {
    if (!currentSkill) return

    const name = formData.get("name") as string
    const icon = selectedIcon // Usar el icono seleccionado del estado

    if (!name || !icon) {
      toast({
        title: "Error al guardar",
        description: "Todos los campos son obligatorios.",
        variant: "destructive",
      })
      return
    }

    // Crear una copia del array de skills del tipo actual
    const currentTypeSkills = [...skills[activeTab as keyof typeof skills]]

    // Verificar si ya existe una skill con ese nombre (excepto si es la misma que estamos editando)
    const existingIndex = currentTypeSkills.findIndex((s) => s.name === name)
    const isEditing = currentSkill.name !== "" && currentSkill.name !== name

    if (existingIndex >= 0 && isEditing) {
      toast({
        title: "Error al guardar",
        description: "Ya existe una habilidad con ese nombre.",
        variant: "destructive",
      })
      return
    }

    const updatedSkill = {
      name,
      icon,
    }

    // Si estamos editando, encontrar y actualizar la skill existente
    if (currentSkill.name !== "") {
      const skillIndex = currentTypeSkills.findIndex((s) => s.name === currentSkill.name)
      if (skillIndex >= 0) {
        currentTypeSkills[skillIndex] = updatedSkill
      } else {
        currentTypeSkills.push(updatedSkill)
      }
    } else {
      // Si es nueva, añadirla al array
      currentTypeSkills.push(updatedSkill)
    }

    // Actualizar el estado local y el contexto global
    const updatedSkills = {
      ...skills,
      [activeTab]: currentTypeSkills,
    }

    setSkills(updatedSkills)
    updateSkills(updatedSkills)
    saveAllContent()

    setIsSkillDialogOpen(false)
    setCurrentSkill(null)
    setSelectedIcon("")

    toast({
      title: currentSkill.name !== "" ? "Habilidad actualizada" : "Habilidad creada",
      description:
        currentSkill.name !== ""
          ? "La habilidad ha sido actualizada correctamente."
          : "La habilidad ha sido creada correctamente.",
      variant: "default",
    })
  }

  // Seleccionar un icono del grid
  const handleSelectIcon = (iconValue: string) => {
    setSelectedIcon(iconValue)
    setShowIconPicker(false)
    setSearchTerm("")
  }

  // Manejar la creación de otras habilidades
  const handleCreateOtherSkill = () => {
    setCurrentOtherSkill("")
    setIsOtherSkillDialogOpen(true)
  }

  const handleEditOtherSkill = (skill: string) => {
    setCurrentOtherSkill(skill)
    setIsOtherSkillDialogOpen(true)
  }

  const handleDeleteOtherSkillConfirm = (skill: string) => {
    setCurrentOtherSkill(skill)
    setIsDeleteOtherSkillDialogOpen(true)
  }

  const handleSaveOtherSkill = (formData: FormData) => {
    const skillName = formData.get("skillName") as string

    if (!skillName) {
      toast({
        title: "Error al guardar",
        description: "El nombre de la habilidad es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const updatedOtherSkills = currentOtherSkill
      ? otherSkills.map((s) => (s === currentOtherSkill ? skillName : s))
      : [...otherSkills, skillName]

    setOtherSkills(updatedOtherSkills)
    updateOtherSkills(updatedOtherSkills)
    saveAllContent()

    setIsOtherSkillDialogOpen(false)
    setCurrentOtherSkill("")

    toast({
      title: currentOtherSkill ? "Habilidad actualizada" : "Habilidad creada",
      description: currentOtherSkill
        ? "La habilidad ha sido actualizada correctamente."
        : "La habilidad ha sido creada correctamente.",
      variant: "default",
    })
  }

  const handleDeleteOtherSkill = () => {
    if (currentOtherSkill) {
      const updatedOtherSkills = otherSkills.filter((s) => s !== currentOtherSkill)
      setOtherSkills(updatedOtherSkills)
      updateOtherSkills(updatedOtherSkills)
      saveAllContent()
      setIsDeleteOtherSkillDialogOpen(false)
      setCurrentOtherSkill("")

      toast({
        title: "Habilidad eliminada",
        description: "La habilidad ha sido eliminada correctamente.",
        variant: "default",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      {/* Add Devicon script */}
      <Script src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Habilidades</h2>
        <Button onClick={handleCreateSkill} className="bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Habilidad
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/40 border border-blue-700/20 mb-6">
          <TabsTrigger
            value="frontend"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Code className="mr-2 h-4 w-4" />
            Frontend
          </TabsTrigger>
          <TabsTrigger value="backend" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <Server className="mr-2 h-4 w-4" />
            Backend
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500"
          >
            <Database className="mr-2 h-4 w-4" />
            Bases de Datos
          </TabsTrigger>
          <TabsTrigger value="devops" className="data-[state=active]:bg-blue-700/20 data-[state=active]:text-blue-500">
            <Braces className="mr-2 h-4 w-4" />
            DevOps
          </TabsTrigger>
        </TabsList>

        {Object.keys(skills).map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <Card className="bg-black/40 border-blue-700/20">
              <CardHeader>
                <CardTitle>
                  Habilidades de{" "}
                  {category === "frontend"
                    ? "Frontend"
                    : category === "backend"
                      ? "Backend"
                      : category === "database"
                        ? "Bases de Datos"
                        : "DevOps"}
                </CardTitle>
                <CardDescription>
                  Gestiona las habilidades de{" "}
                  {category === "frontend"
                    ? "Frontend"
                    : category === "backend"
                      ? "Backend"
                      : category === "database"
                        ? "Bases de Datos"
                        : "DevOps"}{" "}
                  que se mostrarán en tu portafolio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsTable
                  skills={skills[category as keyof typeof skills]}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteConfirm}
                  renderDevIcon={renderDevIcon}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Otras Habilidades</h2>
          <Button onClick={handleCreateOtherSkill} className="bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Habilidad Adicional
          </Button>
        </div>

        <Card className="bg-black/40 border-blue-700/20">
          <CardHeader>
            <CardTitle>Habilidades Adicionales</CardTitle>
            <CardDescription>Gestiona las habilidades adicionales que se mostrarán en tu portafolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <OtherSkillsTable
              skills={otherSkills}
              onEdit={handleEditOtherSkill}
              onDelete={handleDeleteOtherSkillConfirm}
            />
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para crear/editar habilidad */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="bg-black/90 border-blue-700/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentSkill?.name ? "Editar Habilidad" : "Nueva Habilidad"}</DialogTitle>
            <DialogDescription>
              {currentSkill?.name
                ? "Modifica los detalles de la habilidad existente."
                : "Añade una nueva habilidad a tu portafolio."}
            </DialogDescription>
          </DialogHeader>

          <form action={handleSaveSkill} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Habilidad</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentSkill?.name}
                placeholder="Nombre de la habilidad"
                className="bg-black/40 border-blue-700/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Icono de Devicon</Label>
              <div className="flex gap-2">
                <Popover open={showIconPicker} onOpenChange={setShowIconPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-black/40 border-blue-700/20 hover:bg-blue-700/10 hover:border-blue-500"
                    >
                      <div className="flex items-center">
                        {selectedIcon ? (
                          <div className="mr-2 h-6 w-6 flex items-center justify-center">
                            {renderDevIcon(selectedIcon)}
                          </div>
                        ) : (
                          <Search className="mr-2 h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm">
                          {selectedIcon
                            ? deviconOptions.find((opt) => opt.value === selectedIcon)?.label || selectedIcon
                            : "Seleccionar icono"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-black/95 border-blue-700/30">
                    <div className="p-3 border-b border-blue-700/20">
                      <div className="flex items-center mb-2">
                        <Search className="h-4 w-4 text-slate-400 mr-2" />
                        <Input
                          ref={searchInputRef}
                          placeholder="Buscar iconos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-black/40 border-blue-700/20 text-sm h-8"
                        />
                        {searchTerm && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-1"
                            onClick={() => setSearchTerm("")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch id="colored-icons" checked={useColoredIcons} onCheckedChange={setUseColoredIcons} />
                          <Label htmlFor="colored-icons" className="text-xs cursor-pointer">
                            Iconos a color
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => setShowIconGrid(!showIconGrid)}
                        >
                          {showIconGrid ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" /> Mostrar menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" /> Mostrar todos
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-[300px]">
                      {filteredIcons.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400">
                          No se encontraron iconos que coincidan con la búsqueda.
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 p-3">
                          {filteredIcons.map((icon) => (
                            <div
                              key={icon.value}
                              className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-blue-700/20 transition-colors ${
                                selectedIcon === icon.value ? "bg-blue-700/30 border border-blue-500" : ""
                              }`}
                              onClick={() => handleSelectIcon(icon.value)}
                            >
                              {/* Modificar el renderizado de iconos en el selector para usar el mismo estándar */}
                              <div className="h-8 w-8 flex items-center justify-center">
                                {icon.value === "nextjs" ? (
                                  <i
                                    className={`devicon-nextjs-original-wordmark ${useColoredIcons ? "colored" : ""}`}
                                    style={{ fontSize: "1.5rem" }}
                                  ></i>
                                ) : (
                                  <i
                                    className={`devicon-${icon.value}-plain ${useColoredIcons ? "colored" : ""}`}
                                    style={{ fontSize: "1.5rem" }}
                                  ></i>
                                )}
                              </div>
                              <span className="text-xs mt-1 text-center truncate w-full">{icon.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="p-2 border-t border-blue-700/20 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open("https://devicon.dev/", "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Ver todos en Devicon
                      </Button>
                      {selectedIcon && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-500"
                          onClick={() => setShowIconPicker(false)}
                        >
                          <Check className="h-3 w-3 mr-1" /> Usar seleccionado
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
                  onClick={() => window.open("https://devicon.dev/", "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Selecciona un icono de la lista o visita Devicon para ver más opciones.
              </p>
            </div>

            {selectedIcon && (
              <div className="mt-4 flex flex-col items-center">
                <Label className="mb-2">Vista previa del icono</Label>
                {/* Actualizar la vista previa del icono seleccionado para usar el mismo estándar */}
                <div className="h-24 w-24 bg-black/40 border border-blue-700/20 rounded-md flex items-center justify-center p-2">
                  {selectedIcon === "nextjs" ? (
                    <i
                      className={`devicon-nextjs-original-wordmark ${useColoredIcons ? "colored" : ""}`}
                      style={{ fontSize: "3rem" }}
                    ></i>
                  ) : (
                    <i
                      className={`devicon-${selectedIcon}-plain ${useColoredIcons ? "colored" : ""}`}
                      style={{ fontSize: "3rem" }}
                    ></i>
                  )}
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
                    onClick={() => setUseColoredIcons(!useColoredIcons)}
                  >
                    <Palette className="h-3 w-3 mr-1" /> Cambiar color
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSkillDialogOpen(false)}
                className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                Guardar Habilidad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear/editar habilidad adicional */}
      <Dialog open={isOtherSkillDialogOpen} onOpenChange={setIsOtherSkillDialogOpen}>
        <DialogContent className="bg-black/90 border-blue-700/30">
          <DialogHeader>
            <DialogTitle>{currentOtherSkill ? "Editar Habilidad Adicional" : "Nueva Habilidad Adicional"}</DialogTitle>
            <DialogDescription>
              {currentOtherSkill
                ? "Modifica el nombre de la habilidad adicional."
                : "Añade una nueva habilidad adicional a tu portafolio."}
            </DialogDescription>
          </DialogHeader>

          <form action={handleSaveOtherSkill} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Nombre de la Habilidad</Label>
              <Input
                id="skillName"
                name="skillName"
                defaultValue={currentOtherSkill}
                placeholder="Nombre de la habilidad"
                className="bg-black/40 border-blue-700/20"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOtherSkillDialogOpen(false)}
                className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                Guardar Habilidad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar habilidad */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-red-700/30">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la habilidad "{currentSkill?.name}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSkill}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar habilidad adicional */}
      <Dialog open={isDeleteOtherSkillDialogOpen} onOpenChange={setIsDeleteOtherSkillDialogOpen}>
        <DialogContent className="bg-black/90 border-red-700/30">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la habilidad adicional "{currentOtherSkill}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOtherSkillDialogOpen(false)}
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteOtherSkill}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Componente de tabla para mostrar habilidades
function SkillsTable({
  skills,
  onEdit,
  onDelete,
  renderDevIcon,
}: {
  skills: Skill[]
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
  renderDevIcon: (iconName: string) => React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
            <TableHead className="w-[50px]">Icono</TableHead>
            <TableHead>Habilidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length === 0 ? (
            <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
              <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                No hay habilidades disponibles. Haz clic en "Nueva Habilidad" para añadir una.
              </TableCell>
            </TableRow>
          ) : (
            skills.map((skill) => (
              <TableRow key={skill.name} className="border-blue-700/20 hover:bg-blue-900/10">
                <TableCell>
                  <div className="h-10 w-10 flex items-center justify-center bg-black/30 rounded-md p-1">
                    {renderDevIcon(skill.icon)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Componente de tabla para mostrar habilidades adicionales
function OtherSkillsTable({
  skills,
  onEdit,
  onDelete,
}: {
  skills: string[]
  onEdit: (skill: string) => void
  onDelete: (skill: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
            <TableHead>Habilidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length === 0 ? (
            <TableRow className="border-blue-700/20 hover:bg-blue-900/10">
              <TableCell colSpan={2} className="text-center py-8 text-slate-400">
                No hay habilidades adicionales disponibles. Haz clic en "Nueva Habilidad Adicional" para añadir una.
              </TableCell>
            </TableRow>
          ) : (
            skills.map((skill) => (
              <TableRow key={skill} className="border-blue-700/20 hover:bg-blue-900/10">
                <TableCell className="font-medium">{skill}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(skill)}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
