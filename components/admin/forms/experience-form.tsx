"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Definir la interfaz para una experiencia laboral
export interface Experience {
  _id?: string, position: string, company: string, period: string, description: string, skills: string[], companyLogo?: string
  location?: string, achievements?: string[], url?: string, isNew?: boolean
}

interface ExperienceFormProps {
  experience: Experience | null
  editMode: boolean
  setEditMode: (value: boolean) => void
  onSave: (experience: Experience) => void
  onCancel?: () => void
  isNewExperience?: boolean
}

// Componente para el campo de formulario
const FormField = ({ label, name, value, onChange, placeholder, disabled, isTextarea = false
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  disabled: boolean
  isTextarea?: boolean
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    {isTextarea ? (
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-black/40 min-h-[100px]"
        disabled={disabled}
      />
    ) : (
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-black/40"
        disabled={disabled}
      />
    )}
  </div>
);

// Componente para la sección de tecnologías
const TechnologiesSection = ({
  skills,
  editMode,
  newTechnology,
  setNewTechnology,
  addTechnology,
  removeTechnology
}: {
  skills: string[]
  editMode: boolean
  newTechnology: string
  setNewTechnology: (value: string) => void
  addTechnology: () => void
  removeTechnology: (tech: string) => void
}) => (
  <div className="space-y-2">
    <Label className="flex items-center">
      <Tag className="mr-2 h-4 w-4" />
      Tecnologías utilizadas
    </Label>
    <div className="flex flex-wrap gap-2 mb-2">
      {skills?.map((tech, i) => (
        <div
          key={i}
          className="bg-blue-700/20 text-blue-400 px-2 py-1 rounded-md text-sm flex items-center"
        >
          {tech}
          {editMode && (
            <button
              onClick={() => removeTechnology(tech)}
              className="ml-2 text-blue-400 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      {(!skills || skills.length === 0) && (
        <div className="text-gray-500 text-sm italic">
          No hay tecnologías añadidas
        </div>
      )}
    </div>
    {editMode && (
      <div className="flex space-x-2">
        <Input
          value={newTechnology}
          onChange={(e) => setNewTechnology(e.target.value)}
          placeholder="Añadir tecnología (ej: React, Node.js)"
          className="bg-black/40"
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
          type="button"
        >
          Añadir
        </Button>
      </div>
    )}
    <p className="text-xs text-gray-400 mt-1">
      Estas tecnologías se mostrarán como badges en la sección de experiencia.
    </p>
  </div>
);

export default function ExperienceForm({ experience, editMode, setEditMode, onSave, onCancel, isNewExperience = false }: ExperienceFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Experience | null>(experience)
  const [newTechnology, setNewTechnology] = useState("")
  const [emptyFields, setEmptyFields] = useState<Record<string, boolean>>({})

  // Actualizar el formData cuando cambia la experiencia seleccionada
  useEffect(() => {
    if (isNewExperience && experience) {
      const emptyExperience = { ...experience, position: '', company: '', period: '', description: '', skills: [] };
      setFormData(emptyExperience);
    } else {
      setFormData(experience);
    }

    setEmptyFields({});
  }, [experience, isNewExperience]);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmptyFields(prev => ({ ...prev, [name]: value.trim() === '' }))
    setFormData((prev) => prev ? { ...prev, [name]: value } : null)
  }

  // Guardar los cambios
  const handleSave = () => {
    if (formData) {
      const processedData = { ...formData };
      // Validar datos mínimos
      if (!processedData.position.trim() || !processedData.company.trim() || !processedData.period.trim()) {
        toast({ title: "Datos incompletos", description: "Debes completar al menos el cargo, la empresa y el período.", variant: "destructive" })
        return;
      }
      onSave(processedData);
    }
  }

  // Cancelar la edición
  const handleCancel = () => {
    if (onCancel) onCancel()
    else setEditMode(false)
  }

  // Agregar tecnología a la experiencia actual
  const addTechnology = () => {
    if (!newTechnology.trim() || !formData) return;
    const currentSkills = formData.skills || [];

    // Verificar si la tecnología ya existe
    if (currentSkills.includes(newTechnology.trim())) {
      toast({ title: "Tecnología duplicada", description: "Esta tecnología ya está en la lista.", variant: "destructive" })
      return;
    }

    setFormData({ ...formData, skills: [...currentSkills, newTechnology.trim()] });
    setNewTechnology("");

    toast({ title: "Tecnología añadida", description: `"${newTechnology.trim()}" ha sido añadida a la experiencia.`, variant: "default" });
  }

  // Eliminar tecnología de la experiencia actual
  const removeTechnology = (tech: string) => {
    if (!formData) return;

    setFormData({ ...formData, skills: formData.skills.filter((t) => t !== tech) });
  }

  // Si no hay experiencia seleccionada, mostrar mensaje
  if (!formData) {
    return (
      <Card className="bg-black/40 border-blue-700/20">
        <CardHeader>
          <CardTitle>Detalles de la Experiencia</CardTitle>
          <CardDescription>
            Selecciona una experiencia existente o crea una nueva para visualizar detalles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-slate-400 py-4">No hay experiencia seleccionada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardHeader>
        <div>
          <CardTitle>
            {isNewExperience
              ? "Nueva Experiencia"
              : formData.position || "Experiencia sin título"}
          </CardTitle>
          <CardDescription>
            {isNewExperience
              ? "Crea una nueva experiencia laboral"
              : formData.company || "Sin empresa"}
          </CardDescription>
        </div>
        {!editMode && (
          <div className="flex justify-end">
            <Button
              onClick={() => setEditMode(true)}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-950"
              size="sm"
            >
              Editar
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Cargo"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Ej: Desarrollador Full Stack"
              disabled={!editMode}
            />
            <FormField
              label="Empresa"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Ej: Tech Company"
              disabled={!editMode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Período"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              placeholder="Ej: Enero 2022 - Presente"
              disabled={!editMode}
            />
            <FormField
              label="Ubicación"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              placeholder="Ej: Remoto / Ciudad, País"
              disabled={!editMode}
            />
          </div>

          <FormField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe tus responsabilidades y logros en este puesto..."
            disabled={!editMode}
            isTextarea
          />

          <FormField
            label="Logo de la empresa (URL)"
            name="companyLogo"
            value={formData.companyLogo || ""}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
            disabled={!editMode}
          />

          <FormField
            label="URL del proyecto o empresa"
            name="url"
            value={formData.url || ""}
            onChange={handleInputChange}
            placeholder="https://example.com"
            disabled={!editMode}
          />

          <TechnologiesSection
            skills={formData.skills || []}
            editMode={editMode}
            newTechnology={newTechnology}
            setNewTechnology={setNewTechnology}
            addTechnology={addTechnology}
            removeTechnology={removeTechnology}
          />

          {editMode && (
            <div className="flex justify-end space-x-4 pt-4 mt-6 border-t border-blue-700/20">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-950/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Guardar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
