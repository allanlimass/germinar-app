import { DataTable } from "@/components/data-table";
import { getChurchFunctions } from "@/modules/administration/functions/queries";
import { churchFunctionColumns } from "@/modules/administration/functions/_components/columns";
import { getBranchContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChurchFunctionsPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);
  const churchFunctions = await getChurchFunctions(organizationId, branchId);

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
