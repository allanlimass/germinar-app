import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { getFunctions } from "@/db/queries/function";

export default async function FunctionsPage() {
  const functions = await getFunctions();

  return (
    <DataTable
      columns={columns}
      data={functions}
      actionButtonLabel="Função"
      searchableColumn="name"
    />
  );
}
