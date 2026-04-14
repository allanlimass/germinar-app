import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertUserForm } from "../_components/upsert-user-form";

export default async function NewUserPage() {
  const { organizationId } = await getSessionContext();

  return <UpsertUserForm organizationId={organizationId} />;
}
