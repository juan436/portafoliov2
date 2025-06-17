"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import { WhatsappIcon } from "@/components/icons/whatsapp-icon"

export function HeroSocialLinks() {
  return (
    <div className="flex gap-4 mt-8">
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-700/10 hover:text-blue-500">
        <Github className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-700/10 hover:text-blue-500">
        <Linkedin className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-700/10 hover:text-blue-500">
        <Mail className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-green-700/10 hover:text-green-500">
        <WhatsappIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}
