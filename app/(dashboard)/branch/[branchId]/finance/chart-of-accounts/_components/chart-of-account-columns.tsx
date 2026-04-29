"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { listChartOfAccounts } from "@/db/queries/chart-of-accounts";
import { format } from "date-fns";
import { ChartOfAccountActionCell } from "./chart-of-account-action-cell";
import { Badge } from "@/components/ui/badge";

type ChartOfAccountRow = Awaited<
  ReturnType<typeof listChartOfAccounts>
>[number];

export const chartOfAccountColumns: ColumnDef<ChartOfAccountRow>[] = [
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
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return type === "INCOME" ? (
        <Badge className="border border-green-100 bg-green-100 text-green-600">
          Receita
        </Badge>
      ) : (
        <Badge className="border border-red-100 bg-red-100 text-red-600">
          Despesa
        </Badge>
      );
    },
  },
  {
    id: "parentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vínculo" />
    ),
    cell: ({ row }) => row.original.parent?.name ?? "—",
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
      <ChartOfAccountActionCell
        path="/finance/chart-of-accounts"
        id={row.original.id}
      />
    ),
  },
];
