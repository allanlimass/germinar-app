import { DataTable } from "@/components/data-table";
import { churchMemberColumns } from "@/modules/people/church-members/_components/columns";
import { getChurchMembers } from "@/modules/people/church-members/queries";
import { getBranchContext } from "@/lib/utils/db-utils";
import { notFound } from "next/navigation";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const { organizationId } = await getBranchContext(branchId);

  const churchMembers = await getChurchMembers(organizationId, branchId);

  if (!churchMembers) notFound();

  return (
    <div>
      <PageLayout
        title="Membros"
        description="Gerencie os membros da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Novo Membro" />}
      >
        <DataTable data={churchMembers} columns={churchMemberColumns} />
      </PageLayout>
    </div>
  );
}
