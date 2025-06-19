"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Code, Server, Database, Layers, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useContent } from "@/contexts/content"

interface HeroAnimationProps {
  showAnimation: boolean
  toggleAnimation: () => void
  codeLines: string[]
}

export function HeroAnimation({ showAnimation, toggleAnimation, codeLines }: HeroAnimationProps) {
  const { content } = useContent()
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // Datos de desarrollo web para el efecto
  const webDevData = ["REACT", "NODE.JS", "API", "DATABASE", "DOCKER"]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex justify-center"
    >
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Campo de fuerza hexagonal cuántico */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Hexágonos concéntricos */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`hex-${i}`}
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20 + i * 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 },
              }}
              className="absolute border border-blue-500/30 rounded-full"
              style={{
                width: `${300 + i * 40}px`,
                height: `${300 + i * 40}px`,
                clipPath: "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                background: `conic-gradient(from ${i * 45}deg, transparent 0%, rgba(59, 130, 246, 0.05) 16.66%, transparent 33.33%, rgba(59, 130, 246, 0.1) 50%, transparent 66.66%, rgba(59, 130, 246, 0.05) 83.33%, transparent 100%)`,
              }}
            />
          ))}
        </div>

        {/* Rayos de energía cuántica */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const innerRadius = 140
            const outerRadius = 220
            const centerX = 192
            const centerY = 192

            return (
              <motion.g key={`quantum-ray-${i}`}>
                <motion.line
                  x1={centerX + innerRadius * Math.cos(angle)}
                  y1={centerY + innerRadius * Math.sin(angle)}
                  x2={centerX + outerRadius * Math.cos(angle)}
                  y2={centerY + outerRadius * Math.sin(angle)}
                  stroke="rgba(59, 130, 246, 0.8)"
                  strokeWidth="2"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    pathLength: [0, 1, 0],
                    strokeWidth: [1, 3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.25,
                  }}
                />
                {/* Nodos de energía en los extremos */}
                <motion.circle
                  cx={centerX + outerRadius * Math.cos(angle)}
                  cy={centerY + outerRadius * Math.sin(angle)}
                  r="3"
                  fill="rgba(59, 130, 246, 0.9)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.25 + 0.5,
                  }}
                />
              </motion.g>
            )
          })}
        </svg>

        {/* Partículas cuánticas */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`quantum-particle-${i}`}
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: 0,
            }}
            animate={{
              x: [Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200],
              y: [Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-blue-500 rounded-full shadow-md shadow-blue-500/50"
            style={{
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)",
            }}
          />
        ))}

        {/* Datos de desarrollo web flotantes */}
        {webDevData.map((data, index) => (
          <motion.div
            key={`webdev-data-${index}`}
            initial={{
              x: Math.random() * 300 - 150,
              y: Math.random() * 300 - 150,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 1.5,
              ease: "linear",
            }}
            className="absolute text-xs font-mono text-blue-400/40 pointer-events-none font-bold tracking-wider"
            style={{
              textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
            }}
          >
            {data}
          </motion.div>
        ))}

        {/* Ondas de energía cuántica */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`quantum-wave-${i}`}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2.5, 0],
              opacity: [0.8, 0.2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.7,
              ease: "easeOut",
            }}
            className="absolute inset-0 border-2 border-blue-400/40 rounded-full"
            style={{
              background: "radial-gradient(circle, transparent 70%, rgba(59, 130, 246, 0.1) 100%)",
            }}
          />
        ))}

        {/* Imagen del perfil con animación */}
        <div className="absolute inset-0 rounded-full overflow-hidden z-20">
          <div className="relative w-full h-full cursor-pointer" onClick={toggleAnimation}>
            <AnimatePresence>
              {!showAnimation ? (
                <Image
                  src={
                    content.hero.profileImage ||
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg"
                  }
                  alt="Juan Villegas"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover object-center rounded-full"
                  priority
                />
              ) : (
                <motion.div
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900 rounded-full flex flex-col items-center justify-center overflow-hidden"
                  style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                >
                  {/* Partículas de fondo */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100,
                        opacity: 0,
                      }}
                      animate={{
                        x: Math.random() * 300 - 150,
                        y: Math.random() * 300 - 150,
                        opacity: [0, 0.5, 0],
                        scale: [0, 1, 0.5],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3 + Math.random() * 5,
                        delay: Math.random() * 2,
                      }}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    />
                  ))}

                  {/* Líneas de código */}
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center p-8 z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs md:text-sm font-mono text-blue-300 mb-4 w-full max-w-[85%]"
                    >
                      {codeLines.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="whitespace-nowrap overflow-hidden text-center"
                          style={{ textOverflow: "ellipsis" }}
                        >
                          {line}
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Iconos de tecnologías */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex justify-center space-x-4 mt-2"
                    >
                      <motion.div variants={itemVariants} className="p-2 bg-blue-800/50 rounded-full">
                        <Code className="h-4 w-4 text-blue-300" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="p-2 bg-blue-800/50 rounded-full">
                        <Server className="h-4 w-4 text-blue-300" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="p-2 bg-blue-800/50 rounded-full">
                        <Database className="h-4 w-4 text-blue-300" />
                      </motion.div>
                      <motion.div variants={itemVariants} className="p-2 bg-blue-800/50 rounded-full">
                        <Layers className="h-4 w-4 text-blue-300" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-4"
                    >
                      <Button
                        onClick={toggleAnimation}
                        size="sm"
                        className="bg-blue-800/50 hover:bg-blue-700/60 text-blue-300 border border-blue-300/30 rounded-full px-4 py-1 text-xs flex items-center gap-1 transition-colors duration-300"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Volver
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
