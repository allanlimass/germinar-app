"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  icon?: React.ReactNode;
  saveAction?: () => void;
  saveAndContinueAction?: () => void;
  cancelAction?: () => void;
  isEditing?: boolean;
}

export function DashboardHeader({
  heading,
  text,
  icon,
  saveAction,
  saveAndContinueAction,
  cancelAction,
  isEditing,
}: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="bg-background flex h-12 w-12 items-center justify-center rounded-full border">
              {icon}
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="font-heading text-xl font-semibold md:text-2xl">
              {heading}
            </h1>
            {text && <p className="text-muted-foreground text-sm">{text}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={cancelAction}>
            Cancelar
          </Button>

          <ButtonGroup>
            <Button onClick={saveAction}>
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="pl-2!">
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={saveAndContinueAction}>
                    Adicionar e continuar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={saveAndContinueAction}>
                    Adicionar e duplicar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
