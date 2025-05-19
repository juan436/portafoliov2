"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Code, Server, Database, Cpu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Definir la interfaz para un servicio
export interface Service {
  title: string
  description: string
  icon: string
}

interface ServicesFormProps {
  services: Service[]
  onChange: (services: Service[]) => void
}

export default function ServicesForm({ services, onChange }: ServicesFormProps) {
  const { toast } = useToast()
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)

  // Agregar nuevo servicio
  const addNewService = () => {
    const newService: Service = {
      title: "Nuevo Servicio",
      description: "Descripción del nuevo servicio",
      icon: "Code",
    }
    const updatedServices = [...services, newService]
    onChange(updatedServices)
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

    if (services.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos un servicio.",
        variant: "destructive",
      })
      return
    }

    const updatedServices = [...services]
    updatedServices.splice(index, 1)
    onChange(updatedServices)

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

  // Manejar cambios en el servicio activo
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedServices = [...services]
    updatedServices[activeServiceIndex] = {
      ...updatedServices[activeServiceIndex],
      [name]: value,
    }
    onChange(updatedServices)
  }

  // Renderizar el ícono correspondiente
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="h-6 w-6 mx-auto text-blue-500" />
      case "Server":
        return <Server className="h-6 w-6 mx-auto text-blue-500" />
      case "Database":
        return <Database className="h-6 w-6 mx-auto text-blue-500" />
      case "Cpu":
        return <Cpu className="h-6 w-6 mx-auto text-blue-500" />
      default:
        return <Code className="h-6 w-6 mx-auto text-blue-500" />
    }
  }

  return (
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
          {services.map((service, index) => (
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
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{service.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 p-1 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  onClick={(e) => deleteService(index, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length > 0 && (
          <div className="space-y-4 border border-blue-700/20 rounded-lg p-4">
            <h3 className="font-medium mb-2">Editando: {services[activeServiceIndex].title}</h3>
            <div className="space-y-2">
              <Label htmlFor="service-title">Título del Servicio</Label>
              <Input
                id="service-title"
                name="title"
                value={services[activeServiceIndex].title}
                onChange={handleServiceChange}
                className="bg-black/40 border-blue-700/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Descripción</Label>
              <Textarea
                id="service-description"
                name="description"
                value={services[activeServiceIndex].description}
                onChange={handleServiceChange}
                className="min-h-[100px] bg-black/40 border-blue-700/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-icon">Icono</Label>
              <select
                id="service-icon"
                name="icon"
                value={services[activeServiceIndex].icon}
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
        )}
      </CardContent>
    </Card>
  )
}
