import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertBranchForm } from "../_components/upsert-branch-form";
import { listBranchById, listBranchesByType } from "@/db/queries/branches";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getSessionContext();

  const { id } = await params;

  const [branch, headquarters, regionals] = await Promise.all([
    listBranchById(id),
    listBranchesByType("headquarters"),
    listBranchesByType("regional"),
  ]);

  return (
    <UpsertBranchForm
      initialData={branch}
      headquarters={headquarters}
      regionals={regionals}
    />
  );
}
