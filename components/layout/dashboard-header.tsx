"use client";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  icon?: React.ReactNode;
  saveAction?: () => void;
  cancelAction?: () => void;
  isEditing?: boolean;
}

export function DashboardHeader({
  heading,
  text,
  icon,
  saveAction,
  cancelAction,
  isEditing,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white">
              {icon}
            </div>
          )}
          <div className="grid gap-1">
            <h1 className="font-heading text-2xl font-bold md:text-3xl">
              {heading}
            </h1>
            {text && <p className="text-muted-foreground text-sm">{text}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={cancelAction}>
            Cancelar
          </Button>
          <Button onClick={saveAction}>
            {isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
