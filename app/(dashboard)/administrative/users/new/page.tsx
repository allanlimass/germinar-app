import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertUserForm } from "../_components/upsert-user-form";

export default async function NewUserPage() {
  const { organizationId } = await getSessionContext();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Novo Usuário</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para criar um novo usuário
        </p>
      </div>
      <UpsertUserForm organizationId={organizationId} />
    </div>
  );
}
