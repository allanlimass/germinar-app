"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { SupplierActionCell } from "./actions-cell";
import { Supplier } from "../schemas";
import { Badge } from "@/components/ui/badge";
import { PatternFormat } from "react-number-format";

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
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        {row.original.name}
        <Badge variant={"outline"} className="text-xs">
          {row.original.isCompany ? "PJ" : "PF"}
        </Badge>
      </div>
    ),
  },

  {
    id: "document",
    accessorFn: (row) => (row.isCompany ? row.cnpj : row.cpf),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPF/CNPJ" />
    ),
    cell: ({ row }) => (
      <PatternFormat
        value={row.original.isCompany ? row.original.cnpj : row.original.cpf}
        format={
          row.original.isCompany ? "##.###.###/####-##" : "###.###.###-##"
        }
        mask="_"
        displayType="text"
      />
    ),
  },
  {
    id: "location",
    accessorFn: (row) => `${row.city} - ${row.state}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cidade/UF" />
    ),
    cell: ({ row }) => <p>{`${row.original.city}/${row.original.state}`}</p>,
  },
  {
    id: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contato" />
    ),
    cell: ({ row }) => (
      <>
        <p>
          <PatternFormat
            value={row.original.phone}
            format={
              row.original.phone && row.original.phone.length > 10
                ? "(##) #####-####"
                : "(##) ####-####"
            }
            mask="_"
            displayType="text"
          />
        </p>
        <p className="text-muted-foreground">{row.original.email}</p>
      </>
    ),
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
