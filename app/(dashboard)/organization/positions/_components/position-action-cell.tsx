import { deleteChurchPosition } from "@/actions/positions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DataTableActionCell } from "@/components/data-table-action-cell";

interface PositionActionCellProps {
  id: string;
  path: string;
}

export function PositionActionCell({ id, path }: PositionActionCellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    router.push(`${path}/${id}`);
  };

  const deleteAction = useAction(deleteChurchPosition, {
    onSuccess: () => {
      toast.success("Cargo excluído com sucesso!");
      router.refresh();
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error("Erro ao excluir cargo: " + error.serverError);
    },
  });

  const handleDelete = () => {
    deleteAction.execute({ id });
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTableActionCell onEdit={handleEdit} onDelete={() => setOpen(true)} />
    </>
  );
}
