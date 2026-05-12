import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/organization/users/_components/columns";
import { listUsers } from "@/modules/organization/users/queries";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div>
      <PageLayout
        title="Usuários"
        description="Gerencie os usuários da sua organização"
        actions={<PageLayoutActions addButtonLabel="Novo Usuário" />}
      >
        <DataTable data={users} columns={columns} />
      </PageLayout>
    </div>
  );
}
