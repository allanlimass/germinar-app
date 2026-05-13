import { DataTable } from "@/components/data-table";
import { getCostCenters } from "@/modules/finance/cost-centers/queries";
import { costCenterColumns } from "@/modules/finance/cost-centers/_components/columns";
import { getBranchContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function CostCentersPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);
  const costCenters = await getCostCenters(organizationId, branchId);

  return (
    <div>
      <PageLayout
        title="Centros de Custo"
        description="Gerencie os centros de custo da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Novo Centro de Custo" />}
      >
        <DataTable data={costCenters} columns={costCenterColumns} />
      </PageLayout>
    </div>
  );
}
