import { UpsertBranchForm } from "../_components/upsert-branch-form";
import { listBranchesByType } from "@/db/queries/branches";

export default async function NewBranchPage() {
  const [headquarters, regionals] = await Promise.all([
    listBranchesByType("headquarters"),
    listBranchesByType("regional"),
  ]);
  return <UpsertBranchForm headquarters={headquarters} regionals={regionals} />;
}
