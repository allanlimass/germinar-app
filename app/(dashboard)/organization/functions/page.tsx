import { DataTable } from "@/components/data-table";
import { listChurchFunctions } from "@/db/queries/function";
import { churchFunctionColumns } from "./_components/function-columns";
import { getSessionContext } from "@/lib/utils/db-utils";
import { DashboardHeader } from "@/components/layout/header";

export default async function ChurchFunctionsPage() {
  const { organizationId } = await getSessionContext();
  const churchFunctions = await listChurchFunctions(organizationId);

  return (
    <>
      <DashboardHeader
        heading="Funções"
        text="Gerencie as funções da sua igreja"
      />
      <DataTable
        columns={churchFunctionColumns}
        data={churchFunctions}
        actionButtonLabel="Função"
        searchableColumn="name"
      />
    </>
  );
}
