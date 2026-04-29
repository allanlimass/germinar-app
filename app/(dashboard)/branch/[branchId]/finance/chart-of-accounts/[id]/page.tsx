import {
  getChartOfAccountById,
  listChartOfAccounts,
} from "@/db/queries/chart-of-accounts";
import { UpsertChartOfAccountForm } from "../_components/upsert-chart-of-account-form";
import { notFound } from "next/navigation";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function ChartOfAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chartOfAccount = await getChartOfAccountById(id);

  if (!chartOfAccount) {
    notFound();
  }

  const { organizationId } = await getSessionContext();

  const chartOfAccounts = await listChartOfAccounts(organizationId);

  return (
    <UpsertChartOfAccountForm
      initialData={chartOfAccount}
      chartOfAccounts={chartOfAccounts}
    />
  );
}
