import { DataTable } from "@/components/data-table";
import { getFinanceAccounts } from "@/modules/finance/accounts/queries";
import { accountColumns } from "@/modules/finance/accounts/_components/columns";
import { getBranchContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const financeAccounts = await getFinanceAccounts(organizationId, branchId);

  return (
    <div>
      <PageLayout
        title="Contas"
        description="Gerencie as contas da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Nova Conta" />}
      >
        <DataTable data={financeAccounts} columns={accountColumns} />
      </PageLayout>
    </div>
  );
}
