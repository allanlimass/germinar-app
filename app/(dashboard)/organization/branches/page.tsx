import { DataTable } from "@/components/data-table";
import { getBranches } from "@/db/queries/branch";
import { columns, Branch } from "./_components/columns";

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <DataTable
      columns={columns}
      data={branches as Branch[]}
      actionButtonLabel="Filial"
      searchableColumn="name"
    />
  );
}
