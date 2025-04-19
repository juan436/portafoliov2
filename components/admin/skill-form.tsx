"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Search, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Skill } from "@/contexts/content-context"

// Lista de iconos disponibles en Devicon
const availableIcons = [
  "html5",
  "css3",
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "vuejs",
  "angular",
  "svelte",
  "tailwindcss",
  "bootstrap",
  "sass",
  "nodejs",
  "express",
  "nestjs",
  "php",
  "laravel",
  "python",
  "django",
  "flask",
  "java",
  "spring",
  "dotnetcore",
  "csharp",
  "mongodb",
  "mysql",
  "postgresql",
  "sqlite",
  "redis",
  "firebase",
  "git",
  "github",
  "gitlab",
  "docker",
  "kubernetes",
  "amazonwebservices",
  "azure",
  "googlecloud",
  "digitalocean",
  "heroku",
  "vercel",
  "netlify",
  "webpack",
  "vite",
  "babel",
  "eslint",
  "jest",
  "cypress",
  "figma",
  "xd",
  "photoshop",
  "illustrator",
]

// Mapa de iconos que usan sufijos especiales
const specialIcons: Record<string, string> = {
  express: "original",
  nextjs: "original",
  nestjs: "plain-wordmark",
  amazonwebservices: "original",
  digitalocean: "original",
}

interface SkillFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (skill: Skill) => void
  currentSkill: Skill | null
  category: string
}

export default function SkillForm({ isOpen, onClose, onSave, currentSkill, category }: SkillFormProps) {
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [colored, setColored] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar iconos basados en el término de búsqueda
  const filteredIcons = searchTerm
    ? availableIcons.filter((icon) => icon.toLowerCase().includes(searchTerm.toLowerCase()))
    : availableIcons

  // Cargar datos de la habilidad actual si existe
  useEffect(() => {
    if (currentSkill) {
      setName(currentSkill.name)
      setIcon(currentSkill.icon)
      setColored(currentSkill.colored !== false) // Si no está definido, asumimos true
    } else {
      // Valores por defecto para una nueva habilidad
      setName("")
      setIcon("")
      setColored(true)
    }
    // Limpiar búsqueda al abrir el formulario
    setSearchTerm("")
  }, [currentSkill, isOpen])

  const handleSave = () => {
    if (!name.trim() || !icon) {
      return // No guardar si faltan datos esenciales
    }

    onSave({
      name: name.trim(),
      icon,
      colored,
      category,
    })
  }

  // Modificar la función renderDevIcon para manejar específicamente el caso de Next.js
  const renderDevIcon = (iconName: string, isColored = true) => {
    if (!iconName) return null

    // Caso especial para Next.js
    if (iconName === "nextjs") {
      return (
        <i
          className={`devicon-nextjs-original-wordmark ${isColored ? "colored" : ""}`}
          style={{ fontSize: "1.5rem", color: !isColored ? "white" : undefined }}
        ></i>
      )
    }

    // Determinar el sufijo correcto
    const suffix = specialIcons[iconName] || "plain"

    return (
      <i
        className={`devicon-${iconName}-${suffix} ${isColored ? "colored" : ""}`}
        style={{ fontSize: "1.5rem", color: !isColored && !specialIcons[iconName] ? "white" : undefined }}
      ></i>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-blue-700/30 max-w-md">
        <DialogHeader>
          <DialogTitle>{currentSkill ? "Editar Habilidad" : "Nueva Habilidad"}</DialogTitle>
          <DialogDescription>
            {currentSkill
              ? "Modifica los detalles de la habilidad existente."
              : "Añade una nueva habilidad a tu portafolio."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nombre de la habilidad */}
          <div className="space-y-2">
            <Label htmlFor="skillName">Nombre de la Habilidad</Label>
            <Input
              id="skillName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la habilidad"
              className="bg-black/40 border-blue-700/20"
            />
          </div>

          {/* Selector de color */}
          <div className="flex items-center justify-between">
            <Label htmlFor="colored">Icono con color</Label>
            <Switch id="colored" checked={colored} onCheckedChange={setColored} />
          </div>

          {/* Selector de icono */}
          <div className="space-y-2">
            <Label>Selecciona un Icono</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar icono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-black/40 border-blue-700/20"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Icono seleccionado */}
            {icon && (
              <div className="p-4 bg-blue-950/30 rounded-md border border-blue-700/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-2">Icono seleccionado: {icon}</p>
                  <div className="h-10 w-10 mx-auto flex items-center justify-center bg-black/30 rounded-md p-1">
                    {renderDevIcon(icon, colored)}
                  </div>
                </div>
              </div>
            )}

            {/* Grid de iconos */}
            <ScrollArea className="h-60 rounded-md border border-blue-700/20 bg-black/20">
              <div className="grid grid-cols-4 gap-2 p-2">
                {filteredIcons.map((iconName) => (
                  <Button
                    key={iconName}
                    variant={icon === iconName ? "default" : "outline"}
                    className={`h-12 flex flex-col items-center justify-center p-1 ${
                      icon === iconName
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-black/20 border-blue-700/20 hover:bg-blue-900/20"
                    }`}
                    onClick={() => setIcon(iconName)}
                  >
                    {renderDevIcon(iconName)}
                    <span className="text-[10px] mt-1 truncate w-full text-center">{iconName}</span>
                  </Button>
                ))}
                {filteredIcons.length === 0 && (
                  <div className="col-span-4 py-8 text-center text-slate-400">
                    No se encontraron iconos que coincidan con "{searchTerm}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
              Guardar Habilidad
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
