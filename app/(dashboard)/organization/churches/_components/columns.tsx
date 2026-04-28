"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Church } from "@/lib/validations/church";
import { ChurchActionCell } from "./church-action-cell";

export const columns: ColumnDef<Church>[] = [
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
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return type === "headquarters"
        ? "Matriz"
        : type === "regional"
          ? "Regional"
          : "Local";
    },
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
      <DataTableColumnHeader column={column} title="Estado" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const path = "/organization/churches";

      return <ChurchActionCell id={id} path={path} />;
    },
  },
];
