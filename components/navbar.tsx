"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

export default function Navbar() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [translatedTexts, setTranslatedTexts] = useState({
    home: "",
    about: "",
    experience: "",
    projects: "",
    skills: "",
    contact: ""
  })
  const [navItems, setNavItems] = useState<Array<{ name: string, href: string }>>([])

  // Cargar traducciones después de la hidratación
  useEffect(() => {
    setTranslatedTexts({
      home: String(t("nav.home")),
      about: String(t("nav.about")),
      experience: String(t("nav.experience")),
      projects: String(t("nav.projects")),
      skills: String(t("nav.skills")),
      contact: String(t("nav.contact"))
    })
  }, [t])

  // Inicializar los elementos de navegación después de la hidratación
  useEffect(() => {
    setNavItems([
      { name: translatedTexts.home, href: "#home" },
      { name: translatedTexts.about, href: "#about" },
      { name: translatedTexts.experience, href: "#experience" },
      { name: translatedTexts.projects, href: "#projects" },
      { name: translatedTexts.skills, href: "#skills" },
      { name: translatedTexts.contact, href: "#contact" },
    ])
  }, [translatedTexts])

  // Detectar scroll para cambiar el estilo de la barra de navegación
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // También detectar qué sección está activa
      const sections = ["home", "about", "experience", "projects", "skills", "contact"]
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          const elementTop = top + window.scrollY
          const elementBottom = bottom + window.scrollY

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault() // Prevenir el comportamiento predeterminado del enlace

    // Cerrar el menú móvil si está abierto
    if (isOpen) {
      setIsOpen(false)
    }

    // Obtener el ID de la sección (eliminar el #)
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Calcular la posición de desplazamiento (considerando la altura de la barra de navegación)
      const navbarHeight = 80 // Altura aproximada de la barra de navegación
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight

      // Desplazarse suavemente a la posición
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })

      // Actualizar la sección activa
      setActiveSection(targetId)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => handleNavClick(e as any, "#home")}
            className="bg-transparent border-0 cursor-pointer"
            aria-label="Home"
          >
            <svg
              width="80"
              height="48"
              viewBox="0 0 50 30"
              className="hover:scale-105 transition-transform duration-300"
            >
              {/* Background shape */}
              <rect
                x="1"
                y="1"
                width="48"
                height="28"
                rx="6"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />

              {/* J letter */}
              <path
                d="M12 7v10c0 2-1 3-3 3s-3-1-3-3"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* V letter */}
              <path
                d="M18 7l4 13 4-13"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Underscore and DEV */}
              <path d="M30 17h12" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
              <text x="30" y="13" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#e2e8f0">
                DEV
              </text>

              {/* Tech circuit lines */}
              <path d="M3 15h2 M45 15h2" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="5" cy="15" r="1" fill="#3b82f6" />
              <circle cx="45" cy="15" r="1" fill="#3b82f6" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 mr-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={(e) => handleNavClick(e as any, item.href)}
                  className={`transition-colors duration-300 bg-transparent border-0 cursor-pointer ${
                    activeSection === item.href.substring(1)
                      ? "text-blue-500 font-medium"
                      : "text-slate-300 hover:text-blue-500"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <LanguageSwitcher />
          </div>

          {/* Mobile Navigation Toggle and Language Switcher */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-200 hover:text-blue-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 bg-black/90 backdrop-blur-md rounded-lg p-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={(e) => handleNavClick(e as any, item.href)}
                  className={`py-2 transition-colors duration-300 text-left bg-transparent border-0 cursor-pointer ${
                    activeSection === item.href.substring(1)
                      ? "text-blue-500 font-medium"
                      : "text-slate-300 hover:text-blue-500"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}
