"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useContent } from "@/contexts/content"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Experience() {
  const { t } = useLanguage()
  const { content } = useContent()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Asegurarse de que la experiencia esté ordenada por fecha (más reciente primero)
  const sortedExperience = [...content.experience].sort((a, b) => {
    // Extraer el año más reciente de cada período
    const getLatestYear = (period: string) => {
      const years = period.match(/\d{4}/g)
      if (!years) return 0
      return Math.max(...years.map((year) => Number.parseInt(year)))
    }

    const yearA = getLatestYear(a.period)
    const yearB = getLatestYear(b.period)

    return yearB - yearA
  })

  // Extraer años para la línea de tiempo
  const timelineYears = sortedExperience.map((exp) => {
    const match = exp.period.match(/\d{4}/g)
    return match ? match[0] : ""
  })

  // Navegación
  const handleNext = () => {
    if (activeIndex < sortedExperience.length - 1) {
      setActiveIndex(activeIndex + 1)
    } else {
      // Opcional: volver al principio cuando llegue al final
      setActiveIndex(0)
    }
  }

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else {
      // Opcional: ir al final cuando esté en el principio
      setActiveIndex(sortedExperience.length - 1)
    }
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
  }

  // Autoplay
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        handleNext()
      }, 5000) // Cambiar cada 5 segundos
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, activeIndex])

  // Manejo de gestos táctiles para el carrusel
  const handleMouseDown = (e: React.MouseEvent | TouchEvent) => {
    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setStartX(clientX)
  }

  const handleMouseMove = (e: React.MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const diff = startX - clientX

    if (diff > 50) {
      handleNext()
      setIsDragging(false)
    } else if (diff < -50) {
      handlePrev()
      setIsDragging(false)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Agregar event listeners para gestos táctiles
  useEffect(() => {
    const timeline = timelineRef.current
    if (timeline) {
      timeline.addEventListener("touchstart", handleMouseDown as unknown as EventListener)
      timeline.addEventListener("touchmove", handleMouseMove as unknown as EventListener)
      timeline.addEventListener("touchend", handleMouseUp)

      return () => {
        timeline.removeEventListener("touchstart", handleMouseDown as unknown as EventListener)
        timeline.removeEventListener("touchmove", handleMouseMove as unknown as EventListener)
        timeline.removeEventListener("touchend", handleMouseUp)
      }
    }
  }, [isDragging, startX])

  return (
    <section id="experience" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("experience.title")}</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-blue-300 max-w-2xl mx-auto">
            {t("experience.subtitle")}
          </p>
        </motion.div>

        {/* Línea de tiempo horizontal con animación */}
        <motion.div
          className="relative mb-16"
          ref={timelineRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((activeIndex + 1) / sortedExperience.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Marcadores de años */}
          <div className="flex justify-between mt-2">
            {timelineYears.map((year, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className={`relative cursor-pointer transition-all duration-300 ${
                  index === activeIndex ? "scale-125" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => handleDotClick(index)}
              >
                <div
                  className={`w-5 h-5 rounded-full ${
                    index === activeIndex
                      ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.7)]"
                      : "bg-blue-900 hover:bg-blue-700"
                  } transition-all duration-300`}
                />
                {index === activeIndex && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-300 animate-ping" />
                )}
                <div
                  className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm ${
                    index === activeIndex ? "text-blue-400 font-medium" : "text-slate-500"
                  }`}
                >
                  {year}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Carrusel de experiencia */}
        <div className="relative max-w-4xl mx-auto">
          {/* Botones de navegación - Alejados de la carta */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-16 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="rounded-full w-12 h-12 border-blue-700/50 bg-black/50 text-blue-500 hover:bg-blue-900/30 hover:border-blue-500 disabled:opacity-50 hover:scale-110 transition-transform"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-16 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={activeIndex === sortedExperience.length - 1}
              className="rounded-full w-12 h-12 border-blue-700/50 bg-black/50 text-blue-500 hover:bg-blue-900/30 hover:border-blue-500 disabled:opacity-50 hover:scale-110 transition-transform"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Tarjetas de experiencia con nueva transición tipo "flip" */}
          <div
            className="overflow-hidden perspective-3d"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="relative h-[400px] md:h-[350px]">
              <AnimatePresence mode="wait">
                {sortedExperience.map(
                  (experience, index) =>
                    index === activeIndex && (
                      <motion.div
                        key={index}
                        className="absolute inset-0"
                        initial={{
                          opacity: 0,
                          filter: "blur(10px)",
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          filter: "blur(0px)",
                          scale: 1,
                          transition: {
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                        exit={{
                          opacity: 0,
                          filter: "blur(10px)",
                          scale: 1.1,
                          transition: {
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }}
                      >
                        <div className="bg-gray-900/60 rounded-lg p-8 border border-blue-900/30 shadow-xl h-full backdrop-blur-md">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-white">{experience.position}</h3>
                              <div className="flex items-center text-blue-300 mt-2">
                                <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                                <span className="font-medium">{experience.company}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-blue-300 bg-blue-900/30 px-4 py-2 rounded-full">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              <span>{experience.period}</span>
                            </div>
                          </div>

                          <p className="text-slate-300 mb-8 text-lg leading-relaxed">{experience.description}</p>

                          {/* Viñetas de tecnologías */}
                          <div className="mt-6">
                            <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-3">Tecnologías</h4>
                            <motion.div
                              className="flex flex-wrap gap-2"
                              initial="hidden"
                              animate="visible"
                              variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                  opacity: 1,
                                  transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.2,
                                  },
                                },
                              }}
                            >
                              {(experience.skills || ["Git", "REST APIs", "GraphQL", "Testing", "Agile"]).map(
                                (skill, idx) => (
                                  <motion.div
                                    key={idx}
                                    variants={{
                                      hidden: { opacity: 0, y: 10 },
                                      visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 30,
                                        },
                                      },
                                    }}
                                  >
                                    <Badge className="bg-blue-950 text-blue-300 border-blue-900 hover:bg-blue-900 transition-colors py-1.5 px-4 text-sm hover:scale-105 transform duration-200">
                                      {skill}
                                    </Badge>
                                  </motion.div>
                                ),
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Indicadores de posición con animación */}
        <motion.div
          className="flex justify-center mt-8 space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {sortedExperience.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-blue-500 w-8" : "bg-slate-700 w-2 hover:bg-slate-600"
              }`}
              aria-label={`${t("experience.viewExperience")} ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Botón de autoplay */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoPlay}
            className={`text-xs border-blue-700/50 ${
              isAutoPlaying ? "bg-blue-900/30 text-blue-300" : "bg-black/50 text-blue-500"
            } hover:bg-blue-900/30 hover:border-blue-500 transition-all`}
          >
            {isAutoPlaying ? t("experience.pause") : t("experience.autoplay")}
          </Button>
        </motion.div>
      </div>

      {/* Estilos adicionales para la perspectiva 3D */}
      <style jsx global>{`
        .perspective-3d {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
