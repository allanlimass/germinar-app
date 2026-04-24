import { getSessionContext } from "@/lib/utils/db-utils";
import { listChartOfAccounts } from "@/db/queries/chart-of-accounts";
import { DataTable } from "@/components/data-table";
import { DashboardHeader } from "@/components/layout/header";
import { chartOfAccountColumns } from "./_components/chart-of-account-columns";

export default async function ChartOfAccountsPage() {
  const { organizationId } = await getSessionContext();
  const chartOfAccounts = await listChartOfAccounts(organizationId);

  return (
    <>
      <DashboardHeader
        heading="Plano de Contas"
        text="Gerencie as contas da sua organização"
      />
      <DataTable data={chartOfAccounts} columns={chartOfAccountColumns} />
    </>
  );
}
