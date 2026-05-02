import { DataTable } from "@/components/data-table";
import { columns } from "./_components/branch-columns";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";
import { listBranches } from "@/db/queries/branch";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function BranchesPage() {
  const { organizationId } = await getSessionContext();
  const branches = await listBranches(organizationId);

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
