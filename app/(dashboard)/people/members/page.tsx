import { DataTable } from "@/components/data-table";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { columns } from "@/app/(dashboard)/people/members/_components/columns";
import { listChurchMembers } from "@/db/queries/church-member";
import { notFound } from "next/navigation";

export default async function MembersPage() {
  const churchMembers = await listChurchMembers();

  if (!churchMembers) notFound();

  return (
    <>
      <DashboardHeader
        title="Membros"
        description="Gerencie os membros da igreja"
      />
      <DataTable
        data={churchMembers}
        columns={columns}
        entityName="Membro"
        searchableColumn="name"
      />
    </>
  );
}
