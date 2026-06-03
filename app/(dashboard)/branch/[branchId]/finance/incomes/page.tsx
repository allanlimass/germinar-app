import { DataTable } from "@/components/data-table";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";
import { getBranchContext } from "@/lib/utils/db-utils";
import { getIncomes } from "@/modules/finance/incomes/queries";
import { incomeColumns } from "@/modules/finance/incomes/_components/columns";

export default async function IncomesPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const incomes = await getIncomes(organizationId, branchId);

  return (
    <div>
      <PageLayout
        title="Receitas"
        description="Gerencie as receitas da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Nova Receita" />}
      >
        <DataTable data={incomes} columns={incomeColumns} />
      </PageLayout>
    </div>
  );
}
