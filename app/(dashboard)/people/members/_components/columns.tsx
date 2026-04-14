import { churchMember } from "@/db/schema/people";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<typeof churchMember.$inferSelect>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
];
