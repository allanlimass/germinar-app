import { getBranchContext } from "@/lib/utils/db-utils";
import { getAccounts } from "@/modules/finance/accounts/queries";
import { getChartOfAccounts } from "@/modules/finance/chart-of-accounts/queries";
import { getCostCenters } from "@/modules/finance/cost-centers/queries";
import { UpsertIncomeForm } from "@/modules/finance/incomes/_components/upsert-form";
import { getChurchMembers } from "@/modules/people/church-members/queries";

export default async function NewIncomePage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const [contributors, accounts, chartOfAccounts, costCenters] =
    await Promise.all([
      getChurchMembers(organizationId, branchId),
      getAccounts(organizationId, branchId),
      getChartOfAccounts(organizationId, branchId),
      getCostCenters(organizationId, branchId),
    ]);

  return (
    <UpsertIncomeForm
      branchId={branchId}
      contributors={contributors}
      chartOfAccounts={chartOfAccounts}
      costCenters={costCenters}
      accounts={accounts}
    />
  );
}
