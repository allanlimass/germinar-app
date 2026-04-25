import { DataTable } from "@/components/data-table";
import { listChurchFunctions } from "@/db/queries/function";
import { churchFunctionColumns } from "./_components/function-columns";
import { getSessionContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChurchFunctionsPage() {
  const { organizationId } = await getSessionContext();
  const churchFunctions = await listChurchFunctions(organizationId);

  return (
    <div>
      <PageLayout
        title="Funções"
        description="Gerencie as funções da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Nova Função" />}
      >
        <DataTable data={churchFunctions} columns={churchFunctionColumns} />
      </PageLayout>
    </div>
  );
}
