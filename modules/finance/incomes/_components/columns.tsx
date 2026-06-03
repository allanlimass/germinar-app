"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { IncomeActionCell } from "./actions-cell";
import { Income } from "../schemas";
import { PatternFormat } from "react-number-format";
import { Badge } from "@/components/ui/badge";

export const incomeColumns: ColumnDef<Income>[] = [
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
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vencimento" />
    ),
    cell: ({ row }) => format(row.getValue("dueDate"), "dd/MM/yyyy"),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) =>
      PatternFormat({ value: row.getValue("amount"), format: "R$ #.##0,00" }),
  },
  {
    accessorKey: "financeChartOfAccountId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plano de conta" />
    ),
    cell: ({ row }) => row.original.financeChartOfAccountId,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <IncomeActionCell
        path={`/branch/${row.original.branchId}/finance/incomes`}
        id={row.original.id}
      />
    ),
  },
];
