import { getBranchContext } from "@/lib/utils/db-utils";
import { UpsertChartOfAccountForm } from "@/modules/finance/chart-of-accounts/_components/upsert-form";
import { getChartOfAccounts } from "@/modules/finance/chart-of-accounts/queries";

export default async function NewChartOfAccountPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);
  const chartOfAccounts = await getChartOfAccounts(organizationId, branchId);

  return (
    <UpsertChartOfAccountForm
      chartOfAccounts={chartOfAccounts}
      branchId={branchId}
    />
  );
}
