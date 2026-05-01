import { deleteBranchAction } from "@/actions/branch-actions";
import { authClient } from "@/lib/auth-client";
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
import { EyeIcon, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBranchSchema } from "@/lib/validations/branch";
import z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";

interface BranchActionCellProps {
  id: string;
  path: string;
}

export function BranchActionCell({ id, path }: BranchActionCellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    router.push(`${path}/${id}`);
  };

  const handleAccess = () => {
    router.push(`/branch/${id}`);
  };

  const deleteBranch = useAction(deleteBranchAction, {
    onSuccess: () => {
      toast.success("Igreja excluída com sucesso!");
      router.refresh();
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error("Erro ao excluir igreja: " + error.serverError);
    },
  });

  const handleDelete = (data: z.infer<typeof deleteBranchSchema>) => {
    deleteBranch.execute(data);
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
            <AlertDialogAction
              variant="destructive"
              onClick={() => handleDelete({ id })}
            >
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
          <DropdownMenuItem onClick={handleAccess} className="cursor-pointer">
            <EyeIcon className="mr-2 h-4 w-4" />
            Acessar
          </DropdownMenuItem>
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
