import { notFound } from "next/navigation";
import { getCostCenterById } from "@/db/queries/cost-centers";
import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertCostCenterForm } from "../_components/upsert-cost-center";

export default async function EditCostCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organizationId } = await getSessionContext();

  const costCenter = await getCostCenterById(id, organizationId);

  if (!costCenter) return notFound();

  return <UpsertCostCenterForm initialData={costCenter} />;
}
