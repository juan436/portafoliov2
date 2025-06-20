"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Experience } from "@/contexts/content/types"

interface ExperienceCardProps {
  sortedExperience: Experience[]
  activeIndex: number
  handleMouseDown?: (e: React.MouseEvent | TouchEvent) => void
  handleMouseMove?: (e: React.MouseEvent | TouchEvent) => void
  handleMouseUp?: () => void
}

export function ExperienceCard({ 
  sortedExperience, 
  activeIndex,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}: ExperienceCardProps) {
  const { language } = useLanguage();
  
  // Función para obtener el texto traducido o el original si no hay traducción
  const getTranslatedField = (experience: Experience, field: 'position' | 'description' | 'location') => {
    // Si es español o no hay traducciones disponibles, devolver el texto original
    if (language.code === 'es' || !experience.translations || !experience.translations[language.code]) {
      return experience[field] ?? '';
    }
    // Devolver la traducción o el texto original si no hay traducción
    return experience.translations[language.code]?.[field] ?? experience[field] ?? '';
  };

  return (
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
                        <h3 className="text-2xl font-bold text-white">{getTranslatedField(experience, 'position')}</h3>
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

                    <p className="text-slate-300 mb-8 text-lg leading-relaxed">{getTranslatedField(experience, 'description')}</p>

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
  )
}
