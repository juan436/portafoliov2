"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail, Code, Server, Database, Layers, RotateCcw } from "lucide-react"
import { WhatsappIcon } from "@/components/icons/whatsapp-icon"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useContent } from "@/contexts/content"

export default function Hero() {
  const { t } = useLanguage()
  const { content } = useContent()
  const [showAnimation, setShowAnimation] = useState(false)

  const toggleAnimation = () => {
    setShowAnimation(!showAnimation)
  }

  // Variantes para la animación de los iconos
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

  // Variantes para la animación de las líneas de código
  const codeLines = [
    "const dev = {",
    ` name: '${content.hero.title}',`,
    ` role: '${content.hero.subtitle}',`,
    " skills: ['React', 'Node']",
    "};",
  ]

  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-blue-500">{content.hero.title}</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
                {content.hero.subtitle}
              </span>
            </h1>

            <p className="text-slate-400 text-lg mb-8 max-w-lg">{content.hero.description}</p>

            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-blue-700 hover:bg-blue-800">
                <Link href="#projects">
                  {t("hero.projects")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="border-blue-700 text-blue-500 hover:bg-blue-700/10">
                <Link href="#contact">{t("hero.contact")}</Link>
              </Button>
            </div>

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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-blue-700/30 p-1">
              <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-b from-blue-700/20 to-transparent">
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
                        className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black rounded-full flex flex-col items-center justify-center overflow-hidden"
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
                            className="absolute w-1 h-1 bg-blue-500 rounded-full"
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
        </div>
      </div>
    </section>
  )
}
