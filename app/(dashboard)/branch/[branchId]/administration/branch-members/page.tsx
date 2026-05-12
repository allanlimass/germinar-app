import { DataTable } from "@/components/data-table";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";
import { getBranchMembers } from "@/db/queries/branch-members";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function BranchMembersPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const { organizationId } = await getSessionContext();

  const branchMembers = await getBranchMembers(organizationId, branchId);

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
