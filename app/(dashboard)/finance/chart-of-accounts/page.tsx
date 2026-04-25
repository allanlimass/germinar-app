import { getSessionContext } from "@/lib/utils/db-utils";
import { listChartOfAccounts } from "@/db/queries/chart-of-accounts";
import { DataTable } from "@/components/data-table";
import { chartOfAccountColumns } from "./_components/chart-of-account-columns";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChartOfAccountsPage() {
  const { organizationId } = await getSessionContext();
  const chartOfAccounts = await listChartOfAccounts(organizationId);

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
