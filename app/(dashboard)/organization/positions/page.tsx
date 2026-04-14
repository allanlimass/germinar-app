import { DataTable } from "@/components/data-table";
import { getChurchPositions } from "@/db/queries/position";
import { columns } from "./_components/columns";
import { DashboardHeader } from "@/components/layout/header";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function ChurchPositionsPage() {
  const { organizationId } = await getSessionContext();
  const churchPositions = await getChurchPositions(organizationId);

  return (
    <>
      <DashboardHeader
        heading="Cargos"
        text="Gerencie os cargos da sua organização"
      />
      <DataTable
        columns={columns}
        data={churchPositions}
        actionButtonLabel="Cargo"
        searchableColumn="name"
      />
    </>
  );
}
