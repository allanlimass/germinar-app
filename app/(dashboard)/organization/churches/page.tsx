import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function ChurchesPage() {
  const churches = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (!churches) {
    return [];
  }

  return (
    <div>
      <PageLayout
        title="Igrejas"
        description="Gerencie as igrejas da sua organização"
        actions={<PageLayoutActions addButtonLabel="Nova Igreja" />}
      >
        <DataTable data={churches} columns={columns} />
      </PageLayout>
    </div>
  );
}
