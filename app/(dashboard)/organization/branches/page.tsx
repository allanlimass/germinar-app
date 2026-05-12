import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";
import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/organization/branches/_components/columns";
import { getBranches } from "@/modules/organization/branches/queries";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function BranchesPage() {
  const { organizationId } = await getSessionContext();
  const branches = await getBranches(organizationId);

  return (
    <div>
      <PageLayout
        title="Filiais"
        description="Gerencie as filiais da sua organização"
        actions={<PageLayoutActions addButtonLabel="Nova Filial" />}
      >
        <DataTable data={branches ?? []} columns={columns} />
      </PageLayout>
    </div>
  );
}
