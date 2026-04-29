import { UpsertChurchMemberForm } from "../_components/upsert-church-member-form";
import { listChurchPositions } from "@/db/queries/position";
import { listChurchFunctions } from "@/db/queries/function";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function NewChurchMemberPage() {
  const { organizationId } = await getSessionContext();
  const churchPositions = await listChurchPositions(organizationId);
  const churchFunctions = await listChurchFunctions(organizationId);

  return (
    <UpsertChurchMemberForm
      churchPositions={churchPositions}
      churchFunctions={churchFunctions}
    />
  );
}
