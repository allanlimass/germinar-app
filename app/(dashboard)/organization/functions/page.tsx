import { DataTable } from "@/components/data-table";
import { getChurchFunctions } from "@/db/queries/function";
import { columns } from "./_components/columns";

export default async function ChurchFunctionsPage() {
  const churchFunctions = await getChurchFunctions();

  return (
    <DataTable
      columns={columns}
      data={churchFunctions}
      actionButtonLabel="Função"
      searchableColumn="name"
    />
  );
}
