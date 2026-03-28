import { DataTable } from "@/components/data-table";
import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { eq } from "drizzle-orm";
import { columns } from "./_components/columns";

export default async function FunctionsPage() {
  const { organizationId } = await getSessionContext();

  const functions = await db.query.churchFunction.findMany({
    where: eq(churchFunction.organizationId, organizationId),
  });

  return (
    <DataTable columns={columns} data={functions} actionButtonLabel="Função" />
  );
}
