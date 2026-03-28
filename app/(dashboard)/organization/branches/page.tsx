import { columns, Branch } from "./_components/columns";
import { DataTable } from "../../../../components/data-table";
import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { branch } from "@/db/schema/organization";
import { eq } from "drizzle-orm";

export default async function BranchesPage() {
  const { organizationId } = await getSessionContext();

  const branches = await db.query.branch.findMany({
    where: eq(branch.organizationId, organizationId),
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={branches as Branch[]}
        actionButtonLabel="Filial"
      />
    </>
  );
}
