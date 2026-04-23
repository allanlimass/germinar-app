import { DataTable } from "@/components/data-table";
import { listChurchPositions } from "@/db/queries/position";
import { churchPositionColumns } from "./_components/position-columns";
import { DashboardHeader } from "@/components/layout/header";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function ChurchPositionsPage() {
  const { organizationId } = await getSessionContext();
  const churchPositions = await listChurchPositions(organizationId);

  return (
    <>
      <DashboardHeader
        heading="Cargos"
        text="Gerencie os cargos da sua organização"
      />
      <DataTable
        columns={churchPositionColumns}
        data={churchPositions}
        actionButtonLabel="Cargo"
        searchableColumn="name"
      />
    </>
  );
}
