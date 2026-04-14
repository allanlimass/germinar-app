import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { listUsers } from "@/db/queries/users";
import { DashboardHeader } from "@/components/layout/header";

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <>
      <DashboardHeader
        heading="Usuários"
        text="Gerencie os usuários da sua organização"
      />
      <DataTable
        columns={columns}
        data={users}
        searchableColumn="email"
        actionButtonLabel="Usuário"
      />
    </>
  );
}
