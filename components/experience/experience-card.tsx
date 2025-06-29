"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Experience } from "@/contexts/content/types"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

interface ExperienceCardProps {
  sortedExperience: Experience[]
  activeIndex: number
  handleMouseDown?: (e: React.MouseEvent | TouchEvent) => void
  handleMouseMove?: (e: React.MouseEvent | TouchEvent) => void
  handleMouseUp?: () => void
}

// Número máximo de caracteres para mostrar en la descripción resumida
const MAX_DESCRIPTION_LENGTH = 350;

// Altura base de la tarjeta (altura cuando está contraída)
const BASE_CARD_HEIGHT = {
  default: 450, 
  md: 400      
};

export function ExperienceCard({ 
  sortedExperience, 
  activeIndex,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}: ExperienceCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [cardHeight, setCardHeight] = useState<number>(BASE_CARD_HEIGHT.default);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobileView = useRef<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  // Función para obtener el texto traducido o el original si no hay traducción
  const getTranslatedField = (experience: Experience, field: 'position' | 'description' | 'location') => {
    // Si es español o no hay traducciones disponibles, devolver el texto original
    if (language.code === 'es' || !experience.translations || !experience.translations[language.code]) {
      return experience[field] ?? '';
    }
    // Devolver la traducción o el texto original si no hay traducción
    return experience.translations[language.code]?.[field] ?? experience[field] ?? '';
  };

  // Función para alternar la expansión de la descripción
  const toggleDescription = (experienceId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [experienceId]: !prev[experienceId]
    }));
  };

  // Función para determinar si una descripción debe ser truncada
  const shouldTruncate = (description: string) => {
    return description.length > MAX_DESCRIPTION_LENGTH;
  };

  // Función para obtener la descripción formateada (completa o truncada)
  const getFormattedDescription = (experience: Experience) => {
    const description = getTranslatedField(experience, 'description');
    const isExpanded = expandedDescriptions[experience._id || ''];
    
    if (!shouldTruncate(description) || isExpanded) {
      return description;
    }
    
    return `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
  };

  // Detectar cambios en el tamaño de la ventana para ajustar la altura base
  useEffect(() => {
    const handleResize = () => {
      isMobileView.current = window.innerWidth < 768;
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Actualizar la altura del contenedor cuando cambia el contenido
  useEffect(() => {
    if (contentRef.current) {
      const currentExperience = sortedExperience[activeIndex];
      if (!currentExperience) return;

      const experienceId = currentExperience._id || '';
      const isExpanded = expandedDescriptions[experienceId];
      
      // Si está expandido, ajustar la altura al contenido real
      if (isExpanded) {
        // Añadir un pequeño margen para evitar scroll
        const newHeight = contentRef.current.scrollHeight + 20;
        setCardHeight(newHeight);
      } else {
        // Si está contraído, volver a la altura base
        setCardHeight(isMobileView.current ? BASE_CARD_HEIGHT.default : BASE_CARD_HEIGHT.md);
      }
    }
  }, [expandedDescriptions, activeIndex, sortedExperience]);

  // Calcular la altura inicial al cargar el componente
  useEffect(() => {
    // Pequeño timeout para asegurar que el contenido se ha renderizado
    const timer = setTimeout(() => {
      if (contentRef.current) {
        // Medir la altura real del contenido
        const contentHeight = contentRef.current.scrollHeight + 20;
        
        // Usar la mayor entre la altura base y la altura del contenido
        const baseHeight = isMobileView.current ? BASE_CARD_HEIGHT.default : BASE_CARD_HEIGHT.md;
        setCardHeight(Math.max(baseHeight, contentHeight));
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeIndex, sortedExperience]);

  return (
    <div
      className="overflow-hidden perspective-3d"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="relative"
        style={{ minHeight: `${cardHeight}px` }}
      >
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
                  <div 
                    ref={contentRef}
                    className="bg-gray-900/60 rounded-lg p-8 border border-blue-900/30 shadow-xl h-full backdrop-blur-md"
                  >
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

                    <div className="mb-8">
                      <p className="text-slate-300 text-lg leading-relaxed">
                        {getFormattedDescription(experience)}
                      </p>
                      
                      {shouldTruncate(getTranslatedField(experience, 'description')) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-blue-400 hover:text-blue-300 p-0 h-auto flex items-center"
                          onClick={() => toggleDescription(experience._id || '')}
                        >
                          {expandedDescriptions[experience._id || ''] ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Línea divisoria antes de las tecnologías */}
                    <div className="border-t border-blue-900/30 mb-4"></div>

                    {/* Viñetas de tecnologías */}
                    <div className="mt-2">
                      <h4 className="text-sm uppercase tracking-wider text-slate-400 mb-3">{String(t('experience.technologies') || "Tecnologías")}</h4>
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
