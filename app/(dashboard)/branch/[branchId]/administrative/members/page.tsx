import { DataTable } from "@/components/data-table";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";
import { listBranchMembers } from "@/db/queries/branch-member";

export default async function BranchMembersPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const branchMembers = await listBranchMembers(branchId);

  return (
    <div>
      <PageLayout
        title="Usuários"
        description="Gerencie os usuários da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Novo Usuário" />}
      >
        <DataTable data={branchMembers} columns={[]} />
      </PageLayout>
    </div>
  );
}
