import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ChurchesPage() {
  const churches = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (!churches) {
    return [];
  }

  return (
    <DataTable
      columns={columns}
      data={churches}
      actionButtonLabel="Igreja"
      searchableColumn="name"
    />
  );
}
