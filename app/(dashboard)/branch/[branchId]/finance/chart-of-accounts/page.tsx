import { getBranchContext } from "@/lib/utils/db-utils";
import { getChartOfAccounts } from "@/modules/finance/chart-of-accounts/queries";
import { DataTable } from "@/components/data-table";
import { chartOfAccountColumns } from "@/modules/finance/chart-of-accounts/_components/columns";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChartOfAccountsPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const chartOfAccounts = await getChartOfAccounts(organizationId, branchId);

  return (
    <div>
      <PageLayout
        title="Plano de Contas"
        description="Gerencie os plano de contas da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Novo Plano de Conta" />}
      >
        <DataTable data={chartOfAccounts} columns={chartOfAccountColumns} />
      </PageLayout>
    </div>
  );
}
