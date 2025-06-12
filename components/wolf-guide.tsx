"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

type WolfState = "welcome" | "about" | "skills" | "projects" | "contact" | "experience" | "idle"

export default function WolfGuide() {
  const [currentSection, setCurrentSection] = useState<WolfState>("welcome")
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useLanguage()
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  // Short greeting messages for each section
  const messages = {
    welcome: t("wolf.welcome_short") || "¡Hola! Bienvenido",
    about: t("wolf.about_short") || "¡Sobre mí!",
    skills: t("wolf.skills_short") || "Mis habilidades",
    projects: t("wolf.projects_short") || "Mis proyectos",
    contact: t("wolf.contact_short") || "¡Contáctame!",
    experience: t("wolf.experience_short") || "¡Mi experiencia!",
    idle: "",
  }

  // Detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      const sections = [
        { id: "home", state: "welcome" },
        { id: "about", state: "about" },
        { id: "experience", state: "experience" },
        { id: "skills", state: "skills" },
        { id: "projects", state: "projects" },
        { id: "contact", state: "contact" },
      ]

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          const elementTop = top + window.scrollY
          const elementBottom = bottom + window.scrollY

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            // Si estamos entrando a una nueva sección, hacer el lobo visible de nuevo
            if (currentSection !== section.state) {
              setIsVisible(true)

              // Si estamos volviendo a la sección de inicio y ya no es la primera visita
              if (section.state === "welcome" && currentSection !== "idle") {
                setIsFirstVisit(false)
              }
            }
            setCurrentSection(section.state as WolfState)
            return
          }
        }
      }

      setCurrentSection("idle")
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentSection]) // Add currentSection as a dependency

  // Modify the timer useEffect to reset properly between sections
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (currentSection !== "idle" && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false)
      }, 8000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [currentSection, isVisible])

  // Wolf animations for each state
  const getWolfAnimation = () => {
    switch (currentSection) {
      case "welcome":
        return {
          initial: { x: 100, opacity: 0 },
          animate: { x: 0, opacity: 1, transition: { type: "spring", bounce: 0.5 } },
          exit: { x: 100, opacity: 0 },
        }
      case "about":
        return {
          initial: { rotate: 10, opacity: 0 },
          animate: { rotate: 0, opacity: 1, transition: { type: "spring" } },
          exit: { rotate: -10, opacity: 0 },
        }
      case "experience":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300 } },
          exit: { scale: 0.8, opacity: 0 },
        }
      case "skills":
        return {
          initial: { rotate: 0, scale: 0.8, opacity: 0 },
          animate: { rotate: 360, scale: 1, opacity: 1, transition: { duration: 0.8 } },
          exit: { scale: 0.8, opacity: 0 },
        }
      case "projects":
        return {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1, transition: { type: "spring" } },
          exit: { y: 50, opacity: 0 },
        }
      case "contact":
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1, transition: { type: "spring" } },
          exit: { y: -50, opacity: 0 },
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
    }
  }

  // Wolf SVG component with different poses based on state
  function WolfSvg({ state }: { state: WolfState }) {
    // Wolf animations for each state
    const getWolfPose = () => {
      // Si estamos en la sección de bienvenida pero ya no es la primera visita
      if (currentSection === "welcome" && !isFirstVisit) {
        return (
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
            {/* Robot Wolf Body */}
            <g>
              {/* Main body */}
              <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

              {/* Chest core */}
              <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
              <circle cx="55" cy="60" r="4" fill="#F39C12" />
              <circle cx="55" cy="60" r="2" fill="#F5B041" />

              {/* Head - slightly tilted down looking at laptop */}
              <motion.g
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
                transformOrigin="55 36"
              >
                <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Ears */}
                <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                {/* Eyes - focused on screen */}
                <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <motion.circle
                  cx="48"
                  cy="35"
                  r="3"
                  fill="white"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                />
                <motion.circle
                  cx="62"
                  cy="35"
                  r="3"
                  fill="white"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                />

                {/* Snout */}
                <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="51" y="45" width="8" height="2" rx="1" fill="#1A3E4C" />
                <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                <circle cx="60" cy="42" r="1" fill="#1A3E4C" />
              </motion.g>

              {/* Neck */}
              <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

              {/* Arms - typing on laptop */}
              <motion.g animate={{ y: [0, -1, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}>
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
              </motion.g>
              <motion.g
                animate={{ y: [0, -1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5, delay: 0.25 }}
              >
                <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
              </motion.g>
              <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
              <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

              {/* Legs */}
              <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
              <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
              <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
              <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

              {/* Feet */}
              <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
              <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

              {/* Tail */}
              <motion.g
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                transformOrigin="30 65"
              >
                <path
                  d="M30,65 C25,60 15,65 10,60"
                  stroke="#2A7B9B"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M30,65 C25,60 15,65 10,60"
                  stroke="#1A3E4C"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="0,12,0"
                />
              </motion.g>

              {/* Laptop */}
              <rect x="40" y="75" width="30" height="2" fill="#1A3E4C" />
              <rect x="40" y="65" width="30" height="10" rx="1" fill="#3B82F6" />
              <motion.rect
                x="42"
                y="67"
                width="26"
                height="6"
                fill="#0F172A"
                animate={{ opacity: [1, 0.8, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              />
              <motion.path
                d="M45,70 L48,70 M50,70 L55,70 M57,70 L60,70"
                stroke="#3B82F6"
                strokeWidth="0.5"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              />

              {/* Details - rivets and panels */}
              <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
              <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
              <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
              <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
              <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
              <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
            </g>
          </motion.g>
        )
      }

      switch (state) {
        case "welcome":
          return (
            <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
              {/* Robot Wolf Body */}
              <g>
                {/* Main body */}
                <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Chest core */}
                <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="55" cy="60" r="4" fill="#F39C12" />
                <circle cx="55" cy="60" r="2" fill="#F5B041" />

                {/* Head */}
                <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Ears */}
                <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                {/* Eyes */}
                <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="48" cy="35" r="3" fill="white" />
                <circle cx="62" cy="35" r="3" fill="white" />

                {/* Snout */}
                <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="51" y="45" width="8" height="2" rx="1" fill="#1A3E4C" />
                <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                <circle cx="60" cy="42" r="1" fill="#1A3E4C" />

                {/* Neck */}
                <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                {/* Arms */}
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
                <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

                {/* Hands */}
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Legs */}
                <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
                <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

                {/* Feet */}
                <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Tail */}
                <motion.g
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="30 65"
                >
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#2A7B9B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#1A3E4C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0,12,0"
                  />
                </motion.g>

                {/* Details - rivets and panels */}
                <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
                <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
              </g>
            </motion.g>
          )

        case "about":
          return (
            <g>
              {/* Robot Wolf Body */}
              <g>
                {/* Main body */}
                <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Chest core - pulsing */}
                <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <motion.circle
                  cx="55"
                  cy="60"
                  r="4"
                  fill="#F39C12"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                />
                <circle cx="55" cy="60" r="2" fill="#F5B041" />

                {/* Head - slightly tilted */}
                <motion.g
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                  transformOrigin="55 36"
                >
                  <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                  {/* Ears */}
                  <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                  <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                  {/* Eyes - blinking */}
                  <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                  <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                  <motion.circle
                    cx="48"
                    cy="35"
                    r="3"
                    fill="white"
                    animate={{ scaleY: [1, 0.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatType: "reverse" }}
                  />
                  <motion.circle
                    cx="62"
                    cy="35"
                    r="3"
                    fill="white"
                    animate={{ scaleY: [1, 0.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatType: "reverse" }}
                  />

                  {/* Snout - smiling */}
                  <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <path d="M51,46 C54,48 58,48 59,46" stroke="#1A3E4C" fill="none" strokeWidth="1" />
                  <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                  <circle cx="60" cy="42" r="1" fill="#1A3E4C" />
                </motion.g>

                {/* Neck */}
                <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                {/* Arms - one waving */}
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <motion.g
                  animate={{ rotate: [0, -20, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="75 55"
                >
                  <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                </motion.g>
                <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
                <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

                {/* Left Hand */}
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Legs */}
                <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
                <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

                {/* Feet */}
                <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Tail - wagging enthusiastically */}
                <motion.g
                  animate={{ rotate: [0, 30, 0, -30, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  transformOrigin="30 65"
                >
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#2A7B9B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#1A3E4C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0,12,0"
                  />
                </motion.g>

                {/* Details - rivets and panels */}
                <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
                <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
              </g>
            </g>
          )

        case "skills":
          return (
            <g>
              {/* Robot Wolf Body */}
              <g>
                {/* Main body */}
                <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Chest core - spinning */}
                <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }}
                  transformOrigin="55 60"
                >
                  <path d="M55,56 L55,64 M51,60 L59,60" stroke="#F39C12" strokeWidth="2" />
                  <circle cx="55" cy="60" r="2" fill="#F5B041" />
                </motion.g>

                {/* Head */}
                <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Ears */}
                <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                {/* Eyes - tech scanning */}
                <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <motion.rect
                  x="45"
                  y="34"
                  width="6"
                  height="2"
                  fill="white"
                  animate={{ x: [45, 47, 45] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                />
                <motion.rect
                  x="59"
                  y="34"
                  width="6"
                  height="2"
                  fill="white"
                  animate={{ x: [59, 61, 59] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                />

                {/* Snout */}
                <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="51" y="45" width="8" height="2" rx="1" fill="#1A3E4C" />
                <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                <circle cx="60" cy="42" r="1" fill="#1A3E4C" />

                {/* Neck */}
                <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                {/* Arms - holding tools */}
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
                <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

                {/* Hands with tools */}
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <motion.rect
                  x="25"
                  y="70"
                  width="5"
                  height="8"
                  rx="1"
                  fill="#3B82F6"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="30 74"
                />
                <motion.path
                  d="M80,74 L85,74 M82.5,71.5 L82.5,76.5"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                  transformOrigin="80 74"
                />

                {/* Legs */}
                <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
                <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

                {/* Feet */}
                <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Tail */}
                <motion.g
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="30 65"
                >
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#2A7B9B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#1A3E4C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0,12,0"
                  />
                </motion.g>

                {/* Tools around wolf */}
                <motion.g
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
                  transformOrigin="55 55"
                >
                  <motion.rect
                    x="90"
                    y="30"
                    width="10"
                    height="6"
                    fill="#3B82F6"
                    rx="2"
                    animate={{ x: [90, 95, 90], y: [30, 25, 30] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "reverse" }}
                  />
                  <motion.circle
                    cx="90"
                    cy="60"
                    r="4"
                    fill="#3B82F6"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  />
                  <motion.path
                    d="M20,40 L15,45 L25,45 Z"
                    fill="#3B82F6"
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    transformOrigin="20 40"
                  />
                </motion.g>

                {/* Details - rivets and panels */}
                <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
                <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
              </g>
            </g>
          )

        case "projects":
          return (
            <g>
              {/* Robot Wolf Body */}
              <g>
                {/* Main body */}
                <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Chest core */}
                <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="55" cy="60" r="4" fill="#F39C12" />
                <circle cx="55" cy="60" r="2" fill="#F5B041" />

                {/* Head - looking at projects */}
                <motion.g
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="55 36"
                >
                  <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                  {/* Ears */}
                  <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                  <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                  {/* Eyes - focused */}
                  <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                  <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                  <circle cx="49" cy="35" r="2" fill="white" />
                  <circle cx="63" cy="35" r="2" fill="white" />

                  {/* Snout */}
                  <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <rect x="51" y="45" width="8" height="2" rx="1" fill="#1A3E4C" />
                  <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                  <circle cx="60" cy="42" r="1" fill="#1A3E4C" />
                </motion.g>

                {/* Neck */}
                <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                {/* Arms - one pointing */}
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <motion.g
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="75 55"
                >
                  <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <path d="M80,74 L90,68" stroke="#2A7B9B" strokeWidth="4" strokeLinecap="round" />
                  <path
                    d="M80,74 L90,68"
                    stroke="#1A3E4C"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="0,8,0"
                  />
                </motion.g>
                <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
                <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

                {/* Left Hand */}
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Legs */}
                <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
                <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

                {/* Feet */}
                <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Tail */}
                <motion.g
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="30 65"
                >
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#2A7B9B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#1A3E4C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0,12,0"
                  />
                </motion.g>

                {/* Project screens */}
                <motion.rect
                  x="90"
                  y="25"
                  width="12"
                  height="10"
                  fill="#3B82F6"
                  rx="2"
                  animate={{ y: [25, 22, 25] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.2 }}
                />
                <motion.rect
                  x="95"
                  y="40"
                  width="12"
                  height="10"
                  fill="#3B82F6"
                  rx="2"
                  animate={{ y: [40, 37, 40] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
                />

                {/* Details - rivets and panels */}
                <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
                <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
              </g>
            </g>
          )

        case "contact":
          return (
            <g>
              {/* Robot Wolf Body */}
              <g>
                {/* Main body */}
                <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Chest core */}
                <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="55" cy="60" r="4" fill="#F39C12" />
                <circle cx="55" cy="60" r="2" fill="#F5B041" />

                {/* Head */}
                <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Ears */}
                <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                {/* Eyes */}
                <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <circle cx="48" cy="35" r="3" fill="white" />
                <circle cx="62" cy="35" r="3" fill="white" />

                {/* Snout */}
                <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="51" y="45" width="8" height="2" rx="1" fill="#1A3E4C" />
                <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                <circle cx="60" cy="42" r="1" fill="#1A3E4C" />

                {/* Neck */}
                <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                {/* Arms */}
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
                <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

                {/* Hands */}
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Legs */}
                <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
                <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

                {/* Feet */}
                <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Tail */}
                <motion.g
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="30 65"
                >
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#2A7B9B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#1A3E4C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0,12,0"
                  />
                </motion.g>

                {/* Letter in mouth/hands */}
                <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                  <rect x="45" y="48" width="15" height="10" fill="white" stroke="#3B82F6" strokeWidth="1" />
                  <path d="M47,51 L58,51 M47,54 L55,54" stroke="#3B82F6" strokeWidth="0.5" />
                </motion.g>

                {/* Mailbox */}
                <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                  <rect x="80" y="50" width="12" height="15" fill="#3B82F6" />
                  <rect x="80" y="45" width="12" height="5" fill="#2563EB" />
                  <rect x="82" y="55" width="8" height="4" fill="white" stroke="#2563EB" strokeWidth="0.5" />
                </motion.g>

                {/* Details - rivets and panels */}
                <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
                <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
              </g>
            </g>
          )

        case "experience":
          return (
            <g>
              {/* Robot Wolf Body */}
              <g>
                {/* Main body */}
                <rect x="40" y="50" width="30" height="25" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Chest core */}
                <circle cx="55" cy="60" r="6" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                <motion.circle
                  cx="55"
                  cy="60"
                  r="4"
                  fill="#F39C12"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                />
                <circle cx="55" cy="60" r="2" fill="#F5B041" />

                {/* Head - looking at resume/briefcase */}
                <motion.g
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="55 36"
                >
                  <rect x="42" y="25" width="26" height="22" rx="8" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                  {/* Ears */}
                  <polygon points="42,30 35,15 45,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <polygon points="68,30 75,15 65,25" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <polygon points="42,28 38,20 45,25" fill="#F39C12" />
                  <polygon points="68,28 72,20 65,25" fill="#F39C12" />

                  {/* Eyes - focused on briefcase */}
                  <circle cx="48" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                  <circle cx="62" cy="35" r="5" fill="#1A3E4C" stroke="#1A3E4C" strokeWidth="1" />
                  <circle cx="48" cy="36" r="2" fill="white" />
                  <circle cx="62" cy="36" r="2" fill="white" />

                  {/* Snout - professional smile */}
                  <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <path d="M51,46 C54,48 58,48 59,46" stroke="#1A3E4C" fill="none" strokeWidth="1" />
                  <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                  <circle cx="60" cy="42" r="1" fill="#1A3E4C" />
                </motion.g>

                {/* Neck */}
                <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                {/* Arms - one holding briefcase */}
                <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="35" cy="55" r="3" fill="#1A3E4C" />
                <circle cx="75" cy="55" r="3" fill="#1A3E4C" />

                {/* Hands */}
                <rect x="30" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="70" y="70" width="10" height="8" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Briefcase */}
                <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                  <rect x="15" y="65" width="20" height="15" rx="2" fill="#3B82F6" stroke="#1A3E4C" strokeWidth="1" />
                  <rect x="15" y="65" width="20" height="3" rx="1" fill="#2563EB" />
                  <rect x="22" y="65" width="6" height="3" fill="#1A3E4C" />
                  <rect x="22" y="62" width="6" height="3" rx="1" fill="#1A3E4C" />
                </motion.g>

                {/* Legs */}
                <rect x="40" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="60" y="75" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <circle cx="45" cy="75" r="3" fill="#1A3E4C" />
                <circle cx="65" cy="75" r="3" fill="#1A3E4C" />

                {/* Feet */}
                <rect x="38" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                <rect x="58" y="90" width="14" height="6" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />

                {/* Tail */}
                <motion.g
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  transformOrigin="30 65"
                >
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#2A7B9B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M30,65 C25,60 15,65 10,60"
                    stroke="#1A3E4C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="0,12,0"
                  />
                </motion.g>

                {/* Career symbols */}
                <motion.g
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
                  transformOrigin="90 40"
                >
                  <motion.rect
                    x="85"
                    y="25"
                    width="10"
                    height="10"
                    rx="2"
                    fill="#3B82F6"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  />
                  <motion.circle
                    cx="95"
                    cy="45"
                    r="5"
                    fill="#3B82F6"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
                  />
                  <motion.polygon
                    points="80,55 85,60 75,60"
                    fill="#3B82F6"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
                  />
                </motion.g>

                {/* Details - rivets and panels */}
                <circle cx="42" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="55" r="1" fill="#1A3E4C" />
                <circle cx="42" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="68" cy="65" r="1" fill="#1A3E4C" />
                <circle cx="45" cy="28" r="1" fill="#1A3E4C" />
                <circle cx="65" cy="28" r="1" fill="#1A3E4C" />
              </g>
            </g>
          )

        // ... resto del código ...
      }
    }

    return (
      <svg width="110" height="100" viewBox="0 0 110 100">
        {getWolfPose()}
      </svg>
    )
  }

  // Don't render if not visible
  if (!isVisible || currentSection === "idle") return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={getWolfAnimation()}
          className="flex items-center"
        >
          {/* Message bubble - solo mostrar en la primera visita para welcome */}
          {!(currentSection === "welcome" && !isFirstVisit) && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg rounded-br-none shadow-lg text-sm mr-1"
            >
              <p className="whitespace-nowrap">{messages[currentSection]}</p>
              <div className="absolute bottom-3 right-0 w-3 h-3 bg-blue-600 transform rotate-45 translate-x-1"></div>
            </motion.div>
          )}

          {/* Wolf character */}
          <div className="relative">
            <WolfSvg state={currentSection} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
