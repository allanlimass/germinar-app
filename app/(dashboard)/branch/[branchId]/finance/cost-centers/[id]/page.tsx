import { notFound } from "next/navigation";
import { getCostCenterById } from "@/modules/finance/cost-centers/queries";
import { getBranchContext } from "@/lib/utils/db-utils";
import { UpsertCostCenterForm } from "@/modules/finance/cost-centers/_components/upsert-form";

export default async function EditCostCentersPage({
  params,
}: {
  params: Promise<{ id: string; branchId: string }>;
}) {
  const { id, branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const costCenter = await getCostCenterById(id, organizationId, branchId);

  if (!costCenter) return notFound();

  return <UpsertCostCenterForm initialData={costCenter} branchId={branchId} />;
}
