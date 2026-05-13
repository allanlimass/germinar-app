import { getBranchContext } from "@/lib/utils/db-utils";
import { UpsertCostCenterForm } from "@/modules/finance/cost-centers/_components/upsert-form";

export default async function NewCostCentersPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const { organizationId } = await getBranchContext(branchId);

  return <UpsertCostCenterForm branchId={branchId} />;
}
