"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface OtherSkillsTableProps {
  skills: string[]
  onEdit: (skill: string) => void
  onDelete: (skill: string) => void
}

export default function OtherSkillsTable({
  skills,
  onEdit,
  onDelete,
}: OtherSkillsTableProps) {
  return (
    <div className="rounded-md border border-blue-700/20 overflow-hidden">
      <Table>
        <TableHeader className="bg-black/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-blue-300">Nombre</TableHead>
            <TableHead className="w-[120px] text-right text-blue-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <TableRow key={index} className="hover:bg-blue-950/10">
                <TableCell>{skill}</TableCell>
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
              <TableCell colSpan={2} className="text-center text-slate-400 py-4">
                No hay habilidades adicionales registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
