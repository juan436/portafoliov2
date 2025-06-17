"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface AboutProfileProps {
  profileImage: string
  heroTitle: string
  role: string
  engineer: string
  university: string
}

export function AboutProfile({ profileImage, heroTitle, role, engineer, university }: AboutProfileProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 overflow-hidden rounded-lg border-2 border-blue-700/30 p-1 bg-black/30 relative">
        <motion.div
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.4 },
          }}
        >
          <Image
            src={
              profileImage ||
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-E9YRocD6o4olhnzraHWCjLmKjCbspw.jpeg" ||
              "/placeholder.svg"
            }
            alt="Juan Villegas"
            width={400}
            height={500}
            className="object-cover object-top transition-all duration-300"
          />
        </motion.div>
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold">{heroTitle}</h3>
        <p className="text-blue-500">{role}</p>
        <p className="text-sm text-slate-400">
          {engineer}
          <br />
          {university}
        </p>
      </div>
    </div>
  )
}
