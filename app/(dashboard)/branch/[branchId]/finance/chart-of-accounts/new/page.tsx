import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertChartOfAccountForm } from "../_components/upsert-chart-of-account-form";
import { listChartOfAccounts } from "@/db/queries/chart-of-accounts";

export default async function NewChartOfAccountPage() {
  const { organizationId } = await getSessionContext();
  const chartOfAccounts = await listChartOfAccounts(organizationId);

  return <UpsertChartOfAccountForm chartOfAccounts={chartOfAccounts} />;
}
