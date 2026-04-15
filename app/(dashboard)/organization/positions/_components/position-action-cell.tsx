import { deleteChurchPosition } from "@/actions/position-actions";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <PencilIcon className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
