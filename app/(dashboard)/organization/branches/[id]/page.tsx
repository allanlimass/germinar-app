import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertBranchForm } from "@/modules/organization/branches/_components/upsert-form";
import {
  getBranchById,
  getBranchesByType,
} from "@/modules/organization/branches/queries";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getSessionContext();

  const { id } = await params;

  const [branch, headquarters, regionals] = await Promise.all([
    getBranchById(id),
    getBranchesByType("headquarters"),
    getBranchesByType("regional"),
  ]);

  return (
    <UpsertBranchForm
      initialData={branch}
      headquarters={headquarters}
      regionals={regionals}
    />
  );
}
