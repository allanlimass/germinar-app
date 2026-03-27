"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { branch } from "@/db/schema/organization";
import { DataTableActions } from "@/components/data-table-actions";

export type Branch = typeof branch.$inferSelect;

export const columns: ColumnDef<Branch>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
  },
  {
    accessorKey: "isHeadquarter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const isHeadquarter = row.getValue("isHeadquarter") as boolean;
      return isHeadquarter ? "Matriz" : "Filial";
    },
  },
  {
    accessorKey: "cnpj",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNPJ" />
    ),
  },
  {
    accessorKey: "neighborhood",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bairro" />
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cidade" />
    ),
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UF" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions path="/branches" id={row.original.id} />
    ),
  },
];
