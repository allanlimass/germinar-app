import { UpsertAccountForm } from "@/modules/finance/accounts/_components/upsert-form";
import { getBanks } from "@/modules/finance/accounts/queries";

export default async function NewAccountPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const banks = await getBanks();

  return <UpsertAccountForm branchId={branchId} banks={banks} />;
}
