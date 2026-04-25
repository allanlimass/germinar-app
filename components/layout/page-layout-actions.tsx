"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";

interface PageLayoutActionsProps {
  addButtonLabel?: string;
}

export function PageLayoutActions({ addButtonLabel }: PageLayoutActionsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleAdd = () => {
    router.push(`${pathname}/new`);
  };
  const handleImport = () => {
    console.log("Importar");
  };
  const handleExport = () => {
    console.log("Exportar");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleImport}>
        <Upload className="h-4 w-4" />
        Importar
      </Button>

      <Button variant="outline" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Exportar
      </Button>

      <Button onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        {addButtonLabel || "Novo"}
      </Button>
    </div>
  );
}
