import { listChurchFunctions } from "@/db/queries/function";
import { listChurchPositions } from "@/db/queries/position";
import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertChurchMemberForm } from "../_components/upsert-church-member-form";
import { getChurchMemberById } from "@/db/queries/church-member";

export default async function EditChurcheMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organizationId } = await getSessionContext();

  const churchMember = await getChurchMemberById(id, organizationId);
  const churchPositions = await listChurchPositions(organizationId);
  const churchFunctions = await listChurchFunctions(organizationId);

  return (
    <UpsertChurchMemberForm
      initialData={churchMember}
      churchFunctions={churchFunctions}
      churchPositions={churchPositions}
    />
  );
}
