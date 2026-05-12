"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAndInvitation } from "@/db/queries/users";
import { UserActionCell } from "./actions-cell";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<UserAndInvitation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleciona tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleciona linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const { name } = row.original;
      const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage alt={row.original.name} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Função" />;
    },
    cell: ({ row }) => {
      const { role } = row.original;
      const roles = {
        owner: "Proprietário",
        admin: "Administrador",
        member: "Membro",
        secretary: "Secretário",
        treasurer: "Tesoureiro",
      };
      const roleLabel = roles[role];

      return <span>{roleLabel}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      const statuses = {
        pending: {
          label: "Pendente",
          className: "bg-yellow-100 text-yellow-700",
        },
        accepted: {
          label: "Aceito",
          className: "bg-green-100 text-green-700",
        },
        rejected: {
          label: "Recusado",
          className: "bg-red-100 text-red-700",
        },
      };
      const statusLabel = statuses[status];

      return (
        <Badge className={statusLabel.className}>{statusLabel.label}</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserActionCell path="/organization/users" id={row.original.id} />
    ),
  },
];
