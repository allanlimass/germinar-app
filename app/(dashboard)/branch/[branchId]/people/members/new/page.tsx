import { UpsertChurchMemberForm } from "@/modules/people/church-members/_components/upsert-form";
import { getChurchPositions } from "@/modules/administration/positions/queries";
import { getChurchFunctions } from "@/modules/administration/functions/queries";
import { getBranchContext } from "@/lib/utils/db-utils";

export default async function NewChurchMemberPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const churchPositions = await getChurchPositions(organizationId, branchId);
  const churchFunctions = await getChurchFunctions(organizationId, branchId);

  return (
    <UpsertChurchMemberForm
      branchId={branchId}
      churchPositions={churchPositions}
      churchFunctions={churchFunctions}
    />
  );
}
