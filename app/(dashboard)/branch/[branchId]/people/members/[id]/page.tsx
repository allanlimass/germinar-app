import { getChurchFunctions } from "@/modules/administration/functions/queries";
import { getChurchPositions } from "@/modules/administration/positions/queries";
import { getBranchContext } from "@/lib/utils/db-utils";
import { UpsertChurchMemberForm } from "@/modules/people/church-members/_components/upsert-form";
import { getChurchMemberById } from "@/modules/people/church-members/queries";

export default async function EditChurcheMemberPage({
  params,
}: {
  params: Promise<{ id: string; branchId: string }>;
}) {
  const { id, branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const churchMember = await getChurchMemberById(id, organizationId, branchId);
  const churchPositions = await getChurchPositions(organizationId, branchId);
  const churchFunctions = await getChurchFunctions(organizationId, branchId);

  return (
    <UpsertChurchMemberForm
      initialData={churchMember}
      churchFunctions={churchFunctions}
      churchPositions={churchPositions}
      branchId={branchId}
    />
  );
}
