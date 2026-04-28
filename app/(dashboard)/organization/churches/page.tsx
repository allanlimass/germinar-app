import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";
import { listChurches } from "@/db/queries/branches";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function ChurchesPage() {
  const { organizationId } = await getSessionContext();
  const churches = await listChurches(organizationId);

  return (
    <div>
      <PageLayout
        title="Igrejas"
        description="Gerencie as igrejas da sua organização"
        actions={<PageLayoutActions addButtonLabel="Nova Igreja" />}
      >
        <DataTable data={churches ?? []} columns={columns} />
      </PageLayout>
    </div>
  );
}
