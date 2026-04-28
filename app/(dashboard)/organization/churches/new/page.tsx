import { UpsertChurchForm } from "../_components/upsert-church-form";
import { listChurchesByType } from "@/db/queries/branches";

export default async function NewChurchPage() {
  const [headquarters, regionals] = await Promise.all([
    listChurchesByType("headquarters"),
    listChurchesByType("regional"),
  ]);
  return <UpsertChurchForm headquarters={headquarters} regionals={regionals} />;
}
