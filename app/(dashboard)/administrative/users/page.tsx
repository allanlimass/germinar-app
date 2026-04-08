import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { getMembers } from "@/db/queries/users";

export default async function UsersPage() {
  const members = await getMembers();

  return (
    <DataTable
      columns={columns}
      data={members}
      searchableColumn="name"
      actionButtonLabel="Usuário"
    />
  );
}
