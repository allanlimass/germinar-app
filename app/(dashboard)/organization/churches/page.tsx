import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardHeader } from "@/components/layout/header";

export default async function ChurchesPage() {
  const churches = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (!churches) {
    return [];
  }

  return (
    <>
      <DashboardHeader
        heading="Igrejas"
        text="Gerencie as igrejas da sua organização"
      />
      <DataTable
        columns={columns}
        data={churches}
        searchableColumn="name"
        actionButtonLabel="Igreja"
      />
    </>
  );
}
