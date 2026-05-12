import { UpsertBranchForm } from "@/modules/organization/branches/_components/upsert-form";
import { getBranchesByType } from "@/modules/organization/branches/queries";

export default async function NewBranchPage() {
  const [headquarters, regionals] = await Promise.all([
    getBranchesByType("headquarters"),
    getBranchesByType("regional"),
  ]);
  return <UpsertBranchForm headquarters={headquarters} regionals={regionals} />;
}
