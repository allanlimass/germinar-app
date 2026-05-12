import { notFound } from "next/navigation";
import { UpsertChurchFunctionForm } from "@/modules/administration/functions/_components/upsert-form";
import { getChurchFunctionById } from "@/modules/administration/functions/queries";
import { getBranchContext } from "@/lib/utils/db-utils";

export default async function EditChurchFunctionPage({
  params,
}: {
  params: Promise<{ id: string; branchId: string }>;
}) {
  const { id, branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const churchFunction = await getChurchFunctionById(
    id,
    organizationId,
    branchId,
  );

  if (!churchFunction) notFound();

  return (
    <UpsertChurchFunctionForm
      initialData={churchFunction}
      branchId={branchId}
    />
  );
}
