import { DataTable } from "@/components/data-table";
import { listChurchPositions } from "@/db/queries/position";
import { churchPositionColumns } from "./_components/position-columns";
import { getSessionContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChurchPositionsPage() {
  const { organizationId } = await getSessionContext();
  const churchPositions = await listChurchPositions(organizationId);

  return (
    <div>
      <PageLayout
        title="Cargos"
        description="Gerencie os cargos da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Novo Cargo" />}
      >
        <DataTable data={churchPositions} columns={churchPositionColumns} />
      </PageLayout>
    </div>
  );
}
