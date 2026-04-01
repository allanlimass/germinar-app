import { UpsertChurchRoleForm } from "../_components/upsert-role-form";
import { getChurchRoleById } from "@/db/queries/roles";

export default async function EditChurchRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const churchRoleData = await getChurchRoleById(id);

  return <UpsertChurchRoleForm initialData={churchRoleData} />;
}
