"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Skill } from "@/contexts/content-context"

interface SkillsTableProps {
  skills: Skill[]
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
  renderDevIcon: (iconName: string, colored?: boolean) => React.ReactNode
}

export default function SkillsTable({
  skills,
  onEdit,
  onDelete,
  renderDevIcon,
}: SkillsTableProps) {
  return (
    <div className="rounded-md border border-blue-700/20 overflow-hidden">
      <Table>
        <TableHeader className="bg-black/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16 text-blue-300">Ícono</TableHead>
            <TableHead className="text-blue-300">Nombre</TableHead>
            <TableHead className="text-blue-300">Nivel</TableHead>
            <TableHead className="w-[120px] text-right text-blue-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <TableRow key={skill.id} className="hover:bg-blue-950/10">
                <TableCell className="font-medium">{renderDevIcon(skill.icon, true)}</TableCell>
                <TableCell>{skill.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-700 h-full rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs min-w-[32px]">{skill.level}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-900/20"
                      onClick={() => onEdit(skill)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                      onClick={() => onDelete(skill)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-400 py-4">
                No hay habilidades registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
