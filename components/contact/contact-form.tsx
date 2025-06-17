"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface ContactFormProps {
  translatedTexts: {
    formName: string
    email: string
    formSubject: string
    formMessage: string
    formSend: string
  }
}

export function ContactForm({ translatedTexts }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes implementar la lógica para enviar el formulario
    console.log(formData)
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
    // Show success message
    alert("Mensaje enviado con éxito!")
  }

  return (
    <Card className="bg-black/40 border-blue-700/20">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {translatedTexts.formName}
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={translatedTexts.formName}
                required
                className="bg-black/40 border-blue-700/20 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {translatedTexts.email}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu.email@ejemplo.com"
                required
                className="bg-black/40 border-blue-700/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              {translatedTexts.formSubject}
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={translatedTexts.formSubject}
              required
              className="bg-black/40 border-blue-700/20 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              {translatedTexts.formMessage}
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={translatedTexts.formMessage}
              required
              className="min-h-[150px] bg-black/40 border-blue-700/20 focus:border-blue-500"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
            <Send className="mr-2 h-4 w-4" />
            {translatedTexts.formSend}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
