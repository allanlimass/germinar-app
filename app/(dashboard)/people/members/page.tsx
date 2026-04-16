import { DataTable } from "@/components/data-table";
import { DashboardHeader } from "@/components/layout/header";
import { churchMemberColumns } from "@/app/(dashboard)/people/members/_components/church-member-columns";
import { listChurchMembers } from "@/db/queries/church-member";
import { getSessionContext } from "@/lib/utils/db-utils";
import { notFound } from "next/navigation";

export default async function MembersPage() {
  const { organizationId } = await getSessionContext();
  const churchMembers = await listChurchMembers(organizationId);

  if (!churchMembers) notFound();

  return (
    <>
      <DashboardHeader heading="Membros" text="Gerencie os membros da igreja" />
      <DataTable
        data={churchMembers}
        columns={churchMemberColumns}
        actionButtonLabel="Membro"
        searchableColumn="name"
      />
    </>
  );
}
