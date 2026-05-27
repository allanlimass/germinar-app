"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { AccountActionCell } from "./actions-cell";
import { AccountWithBank } from "../schemas";
import { Badge } from "@/components/ui/badge";
import { NumericFormat } from "react-number-format";

export const accountColumns: ColumnDef<
  AccountWithBank & { balance: number }
>[] = [
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
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <Badge variant={"outline"}>
        {row.original.type === "checking"
          ? "Conta Corrente"
          : row.original.type === "savings"
            ? "Poupança"
            : "Dinheiro"}
      </Badge>
    ),
  },
  {
    id: "bank",
    accessorFn: (row) => row.bank?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banco" />
    ),
    cell: ({ row }) => <p>{row.original.bank?.name || "-"}</p>,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Saldo" />
    ),
    cell: ({ row }) => (
      <NumericFormat
        prefix="R$ "
        displayType="text"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        value={row.original.balance}
        renderText={(value) => <p>{value}</p>}
      />
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
      <AccountActionCell
        path={`/branch/${row.original.branchId}/finance/accounts`}
        id={row.original.id}
      />
    ),
  },
];
