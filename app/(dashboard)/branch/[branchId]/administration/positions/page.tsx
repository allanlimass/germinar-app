import { DataTable } from "@/components/data-table";
import { getChurchPositions } from "@/modules/administration/positions/queries";
import { churchPositionColumns } from "@/modules/administration/positions/_components/columns";
import { getBranchContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChurchPositionsPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);
  const churchPositions = await getChurchPositions(organizationId, branchId);

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
