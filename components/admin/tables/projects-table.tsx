"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { Project } from "@/contexts/content-context"

interface ProjectsTableProps {
  projects: Project[]
  selectedId: number | undefined
  onSelect: (project: Project) => void
  isCompact?: boolean
}

export default function ProjectsTable({
  projects,
  selectedId,
  onSelect,
  isCompact = false
}: ProjectsTableProps) {
  // Ordenar proyectos por fecha de creación (más reciente primero)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  )

  return (
    <div className="space-y-2">
      {sortedProjects.length > 0 ? (
        sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-md cursor-pointer
              ${
                selectedId === project.id
                  ? "bg-blue-700/20 border border-blue-500/40"
                  : "bg-black/30 border border-blue-700/10 hover:bg-blue-900/20"
              }`}
            onClick={() => onSelect(project)}
          >
            <div>
              <h3 className="font-medium text-white/90 truncate">{project.title}</h3>
              <p className="text-xs text-white/60 mt-1 line-clamp-1">
                {project.description}
              </p>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-6 text-white/60">
          <p>No hay proyectos disponibles.</p>
        </div>
      )}
    </div>
  )
}
