import { notFound } from "next/navigation";
import { UpsertChurchPositionForm } from "@/modules/administration/positions/_components/upsert-form";
import { getChurchPositionById } from "@/modules/administration/positions/queries";
import { getBranchContext } from "@/lib/utils/db-utils";

export default async function EditChurchPositionPage({
  params,
}: {
  params: Promise<{ id: string; branchId: string }>;
}) {
  const { id, branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const churchPosition = await getChurchPositionById(
    id,
    organizationId,
    branchId,
  );

  if (!churchPosition) notFound();

  return (
    <UpsertChurchPositionForm
      initialData={churchPosition}
      branchId={branchId}
    />
  );
}
