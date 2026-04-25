import { DataTable } from "@/components/data-table";
import { churchMemberColumns } from "@/app/(dashboard)/people/members/_components/church-member-columns";
import { listChurchMembers } from "@/db/queries/church-member";
import { getSessionContext } from "@/lib/utils/db-utils";
import { notFound } from "next/navigation";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function MembersPage() {
  const { organizationId } = await getSessionContext();
  const churchMembers = await listChurchMembers(organizationId);

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
