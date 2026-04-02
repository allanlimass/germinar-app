import { DataTable } from "@/components/data-table";
import { getChurchPositions } from "@/db/queries/position";
import { columns } from "./_components/columns";

export default async function ChurchPositionsPage() {
  const churchPositions = await getChurchPositions();

  return (
    <DataTable
      columns={columns}
      data={churchPositions}
      actionButtonLabel="Cargo"
      searchableColumn="name"
    />
  );
}
