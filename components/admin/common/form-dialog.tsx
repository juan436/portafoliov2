"use client"

import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  title: string
  description: string
  children: ReactNode
  submitLabel?: string
  cancelLabel?: string
}

export function FormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar"
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-blue-700/20">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {children}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onSubmit} className="bg-blue-700 hover:bg-blue-800">
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}