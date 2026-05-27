import { getAccountById, getBanks } from "@/modules/finance/accounts/queries";
import { getBranchContext } from "@/lib/utils/db-utils";
import { UpsertAccountForm } from "@/modules/finance/accounts/_components/upsert-form";
import { notFound } from "next/navigation";

export default async function AccountEditPage({
  params,
}: {
  params: Promise<{ branchId: string; id: string }>;
}) {
  const { branchId, id } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const account = await getAccountById(organizationId, branchId, id);
  const banks = await getBanks();

  if (!account) return notFound();

  return (
    <UpsertAccountForm
      initialData={account}
      branchId={branchId}
      banks={banks}
    />
  );
}
