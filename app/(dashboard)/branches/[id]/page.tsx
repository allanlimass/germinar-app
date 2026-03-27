import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertBranchForm } from "../_components/upsert-branch-form";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { branch } from "@/db/schema/organization";
import { Branch } from "../_components/columns";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { organizationId } = await getSessionContext();
  const { id } = await params;

  const branchData = await db.query.branch.findFirst({
    where: and(eq(branch.id, id), eq(branch.organizationId, organizationId)),
  });

  return <UpsertBranchForm initialData={branchData as Branch} />;
}
