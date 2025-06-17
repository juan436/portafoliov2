"use client"

import { motion } from "framer-motion"

interface OtherSkillsProps {
  otherSkills: Array<{
    _id?: string
    name: string
  }>
  translatedTexts: {
    other: string
    [key: string]: string
  }
}

export function OtherSkills({ otherSkills, translatedTexts }: OtherSkillsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="mt-16"
    >
      <h3 className="text-xl font-semibold mb-6 text-center">{translatedTexts.other}</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {otherSkills.map((skill, index) => (
          <motion.span
            key={skill._id || `other-skill-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="px-3 py-1 bg-blue-700/20 text-blue-400 rounded-full text-sm border border-blue-700/30 hover:bg-blue-700/30 transition-colors"
          >
            {skill.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}
