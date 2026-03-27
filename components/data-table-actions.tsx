import { Button } from "./ui/button";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
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
import { useState } from "react";
import { deleteBranch } from "@/app/actions/branch";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

interface DataTableActionsProps {
  path: string;
  id: string;
}

export function DataTableActions({ path, id }: DataTableActionsProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onEdit = () => {
    router.push(`${path}/${id}`);
    router.refresh();
  };

  const deleteBranchAction = useAction(deleteBranch, {
    onSuccess: () => {
      toast.success("Filial excluída com sucesso!");
      router.refresh();
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error("Erro ao excluir filial: " + error.serverError);
    },
  });

  const onDelete = () => {
    deleteBranchAction.execute({ id });
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
            <AlertDialogAction variant="destructive" onClick={onDelete}>
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
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
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
