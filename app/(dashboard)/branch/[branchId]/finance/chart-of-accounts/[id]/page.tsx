import { getBranchContext } from "@/lib/utils/db-utils";
import {
  getChartOfAccountById,
  getChartOfAccounts,
} from "@/modules/finance/chart-of-accounts/queries";
import { UpsertChartOfAccountForm } from "@/modules/finance/chart-of-accounts/_components/upsert-form";
import { notFound } from "next/navigation";

export default async function ChartOfAccountPage({
  params,
}: {
  params: Promise<{ id: string; branchId: string }>;
}) {
  const { id, branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const chartOfAccount = await getChartOfAccountById(
    id,
    organizationId,
    branchId,
  );

  if (!chartOfAccount) {
    notFound();
  }

  const chartOfAccounts = await getChartOfAccounts(organizationId, branchId);

  return (
    <UpsertChartOfAccountForm
      initialData={chartOfAccount}
      chartOfAccounts={chartOfAccounts}
      branchId={branchId}
    />
  );
}
