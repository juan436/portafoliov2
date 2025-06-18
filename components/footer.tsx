"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react"
import { WhatsappIcon } from "@/components/icons/whatsapp-icon"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useState, useEffect } from "react"

export default function Footer() {
  const { t } = useLanguage()
  const [translatedTexts, setTranslatedTexts] = useState({
    rights: "",
    role: ""
  })
  
  // Cargar traducciones después de la hidratación
  useEffect(() => {
    setTranslatedTexts({
      rights: String(t("footer.rights")),
      role: String(t("footer.role"))
    })
  }, [t])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-black py-12 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-20" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="icon"
              className="rounded-full border-blue-700 text-blue-500 hover:bg-blue-700/10"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex gap-6 mb-8"
          >
            <Link href="#" className="text-slate-400 hover:text-blue-500 transition-colors duration-300">
              <Github className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-blue-500 transition-colors duration-300">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-blue-500 transition-colors duration-300">
              <Mail className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-green-500 transition-colors duration-300">
              <WhatsappIcon className="h-6 w-6" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-slate-400 mb-2">
              &copy; {new Date().getFullYear()} Juan Villegas. {translatedTexts.rights}
            </p>
            <p className="text-slate-500 text-sm">{translatedTexts.role}</p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
