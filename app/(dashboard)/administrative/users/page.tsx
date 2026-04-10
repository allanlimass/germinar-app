import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { listUsers } from "@/db/queries/users";

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <DataTable
      columns={columns}
      data={users}
      searchableColumn="email"
      actionButtonLabel="Usuário"
    />
  );
}
