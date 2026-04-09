import { DataTable } from "@/components/data-table";
import { listChurchesByUserId } from "@/db/queries/churches";
import { columns } from "./_components/columns";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function ChurchesPage() {
  const { session } = await getSessionContext();

  const churches = await listChurchesByUserId(session.user?.id);

  return (
    <DataTable
      columns={columns}
      data={churches}
      actionButtonLabel="Igreja"
      searchableColumn="name"
    />
  );
}
