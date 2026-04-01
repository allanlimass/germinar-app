import { DataTable } from "@/components/data-table";
import { getChurchRoles } from "@/db/queries/roles";
import { columns } from "./_components/columns";

export default async function ChurchRolesPage() {
  const churchRoles = await getChurchRoles();

  return (
    <DataTable
      columns={columns}
      data={churchRoles}
      actionButtonLabel="Função"
      searchableColumn="name"
    />
  );
}
