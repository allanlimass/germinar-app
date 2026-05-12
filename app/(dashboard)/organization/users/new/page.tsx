import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertUserForm } from "@/modules/organization/users/_components/upsert-form";

export default async function NewUserPage() {
  const { organizationId } = await getSessionContext();

  return <UpsertUserForm organizationId={organizationId} />;
}
