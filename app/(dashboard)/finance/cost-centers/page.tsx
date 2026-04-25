import { DataTable } from "@/components/data-table";
import { listCostCenters } from "@/db/queries/cost-center";
import { costCenterColumns } from "./_components/cost-center-columns";
import { getSessionContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChurchFunctionsPage() {
  const { organizationId } = await getSessionContext();
  const costCenters = await listCostCenters(organizationId);

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
