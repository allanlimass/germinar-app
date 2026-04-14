import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertUserForm } from "../_components/upsert-user-form";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function NewUserPage() {
  const { organizationId } = await getSessionContext();

  return (
    <>
      <DashboardHeader
        title="Novo Usuário"
        description="Preencha os campos abaixo para criar um novo usuário"
      />
      <UpsertUserForm organizationId={organizationId} />
    </>
  );
}
