import { db } from "@/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { branch } from "@/db/schema/organization";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { columns, Branch } from "./columns";
import { DataTable } from "./data-table";

export default async function BranchesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const activeOrganizationId = session?.session.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new Error("Usuário sem organização ativa.");
  }

  const branches = await db.query.branch.findMany({
    where: eq(branch.organizationId, activeOrganizationId),
  });

  return (
    <main>
      <div className="flex flex-row justify-between">
        <h1>Branch</h1>
        <Link href="/branches/new">
          <Button>Adicionar</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={branches} />
    </main>
  );
}
