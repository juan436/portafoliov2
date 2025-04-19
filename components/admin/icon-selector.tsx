"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Search, X, ChevronDown, ChevronUp, ExternalLink, Check, Palette } from "lucide-react"

// Lista completa de iconos de Devicon organizados por categoría
const deviconIcons = [
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
  { value: "materialui", label: "Material UI", category: "frontend" },
  { value: "flutter", label: "Flutter", category: "frontend" },
  { value: "svelte", label: "Svelte", category: "frontend" },

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
  { value: "nestjs", label: "NestJS", category: "backend" },
  { value: "fastapi", label: "FastAPI", category: "backend" },

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
  { value: "supabase", label: "Supabase", category: "database" },

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
  { value: "terraform", label: "Terraform", category: "devops" },
  { value: "ansible", label: "Ansible", category: "devops" },

  // Mobile
  { value: "android", label: "Android", category: "mobile" },
  { value: "apple", label: "iOS", category: "mobile" },
  { value: "reactnative", label: "React Native", category: "mobile" },
  { value: "swift", label: "Swift", category: "mobile" },
  { value: "kotlin", label: "Kotlin", category: "mobile" },
  { value: "flutter", label: "Flutter", category: "mobile" },

  // Testing
  { value: "jest", label: "Jest", category: "testing" },
  { value: "mocha", label: "Mocha", category: "testing" },
  { value: "cypress", label: "Cypress", category: "testing" },
  { value: "selenium", label: "Selenium", category: "testing" },
]

interface IconSelectorProps {
  selectedIcon: string
  onSelectIcon: (icon: string) => void
  category?: string
}

export default function IconSelector({ selectedIcon, onSelectIcon, category }: IconSelectorProps) {
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAllIcons, setShowAllIcons] = useState(false)
  const [useColoredIcons, setUseColoredIcons] = useState(true)
  const [filteredIcons, setFilteredIcons] = useState(deviconIcons)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filtrar iconos basados en el término de búsqueda y la categoría
  useEffect(() => {
    let filtered = deviconIcons

    // Filtrar por categoría si no estamos mostrando todos los iconos
    if (!showAllIcons && category) {
      filtered = filtered.filter((icon) => icon.category === category)
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
  }, [searchTerm, category, showAllIcons])

  // Enfocar el campo de búsqueda cuando se abre el selector
  useEffect(() => {
    if (showIconPicker && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [showIconPicker])

  // Renderizar el icono seleccionado
  const renderSelectedIcon = () => {
    if (!selectedIcon) return null
    return (
      <i
        className={`devicon-${selectedIcon}-plain ${useColoredIcons ? "colored" : ""}`}
        style={{ fontSize: "1.5rem" }}
      />
    )
  }

  return (
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
                  <div className="mr-2 h-6 w-6 flex items-center justify-center">{renderSelectedIcon()}</div>
                ) : (
                  <Search className="mr-2 h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm">
                  {selectedIcon
                    ? deviconIcons.find((opt) => opt.value === selectedIcon)?.label || selectedIcon
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={() => setSearchTerm("")}>
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
                  onClick={() => setShowAllIcons(!showAllIcons)}
                >
                  {showAllIcons ? (
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
                      onClick={() => {
                        onSelectIcon(icon.value)
                        setShowIconPicker(false)
                      }}
                    >
                      <div className="h-8 w-8 flex items-center justify-center">
                        <i
                          className={`devicon-${icon.value}-plain ${useColoredIcons ? "colored" : ""}`}
                          style={{ fontSize: "1.5rem" }}
                        ></i>
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

      {selectedIcon && (
        <div className="mt-4 flex flex-col items-center">
          <Label className="mb-2">Vista previa del icono</Label>
          <div className="h-24 w-24 bg-black/40 border border-blue-700/20 rounded-md flex items-center justify-center p-2">
            <i
              className={`devicon-${selectedIcon}-plain ${useColoredIcons ? "colored" : ""}`}
              style={{ fontSize: "3rem" }}
            />
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs border-blue-700/50 text-blue-500 hover:bg-blue-700/10"
              onClick={() => setUseColoredIcons(!useColoredIcons)}
            >
              <Palette className="h-3 w-3 mr-1" /> {useColoredIcons ? "Sin color" : "Con color"}
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-1">
        Selecciona un icono de la lista o visita{" "}
        <a
          href="https://devicon.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Devicon
        </a>{" "}
        para ver más opciones.
      </p>
    </div>
  )
}
