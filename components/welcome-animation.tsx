"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export default function WelcomeAnimation() {
  const [showAnimation, setShowAnimation] = useState(false)
  const { t } = useLanguage()

  // Solo mostrar la animación en la primera visita
  useEffect(() => {
    // Verificar si es la primera visita
    const hasVisitedBefore = sessionStorage.getItem("hasVisitedBefore")

    if (!hasVisitedBefore) {
      // Primera visita, mostrar animación
      setShowAnimation(true)
      // Marcar que ya ha visitado el sitio
      sessionStorage.setItem("hasVisitedBefore", "true")

      // Ocultar la animación después de completarse
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <AnimatePresence>
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <svg width="150" height="150" viewBox="0 0 120 100">
              <motion.g
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: 1,
                }}
              >
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
                    transition={{ repeat: 2, duration: 1 }}
                  />
                  <circle cx="55" cy="60" r="2" fill="#F5B041" />

                  {/* Head */}
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
                    transition={{ repeat: 1, duration: 1.5, delay: 1 }}
                  />
                  <motion.circle
                    cx="62"
                    cy="35"
                    r="3"
                    fill="white"
                    animate={{ scaleY: [1, 0.2, 1] }}
                    transition={{ repeat: 1, duration: 1.5, delay: 1 }}
                  />

                  {/* Snout - smiling */}
                  <rect x="48" y="40" width="14" height="10" rx="5" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <path d="M51,46 C54,48 58,48 59,46" stroke="#1A3E4C" fill="none" strokeWidth="1" />
                  <circle cx="50" cy="42" r="1" fill="#1A3E4C" />
                  <circle cx="60" cy="42" r="1" fill="#1A3E4C" />

                  {/* Neck */}
                  <rect x="50" y="47" width="10" height="3" rx="1" fill="#1A3E4C" />

                  {/* Arms - waving */}
                  <rect x="30" y="55" width="10" height="15" rx="3" fill="#2A7B9B" stroke="#1A3E4C" strokeWidth="2" />
                  <motion.g
                    animate={{ rotate: [0, -20, 0, -20, 0] }}
                    transition={{ duration: 2, times: [0, 0.25, 0.5, 0.75, 1], repeat: 1 }}
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
                    transition={{ repeat: 2, duration: 1 }}
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
            </svg>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4 text-blue-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Juan Villegas
          </motion.h1>

          <motion.div
            className="max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <p className="text-lg text-slate-300">{t("wolf.welcome")}</p>
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto">
              <motion.div
                className="w-full h-full border-t-4 border-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: 1, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
