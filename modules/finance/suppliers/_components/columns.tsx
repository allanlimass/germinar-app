"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { SupplierActionCell } from "./actions-cell";
import { Supplier } from "../schemas";
import { Badge } from "@/components/ui/badge";

export const supplierColumns: ColumnDef<Supplier>[] = [
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
    cell: ({ row }) => <p className="font-medium">{row.original.name}</p>,
  },
  {
    accessorKey: "isCompany",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => <Badge>{row.original.isCompany ? "PJ" : "PF"}</Badge>,
  },
  {
    id: "document",
    accessorFn: (row) => (row.isCompany ? row.cnpj : row.cpf),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPF/CNPJ" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefone" />
    ),
    cell: ({ row }) => <p>{row.original.phone}</p>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => format(row.getValue("createdAt"), "dd/MM/yyyy HH:mm:ss"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <SupplierActionCell
        path={`/branch/${row.original.branchId}/finance/suppliers`}
        id={row.original.id}
      />
    ),
  },
];
