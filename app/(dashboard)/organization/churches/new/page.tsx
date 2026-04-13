import { DashboardHeader } from "@/components/layout/dashboard-header";
import { UpsertChurchForm } from "../_components/upsert-church-form";
import { listChurchesByType } from "@/db/queries/churches";

export default async function NewChurchPage() {
  const [headquarters, regionals] = await Promise.all([
    listChurchesByType("headquarters"),
    listChurchesByType("regional"),
  ]);

  return (
    <>
      <DashboardHeader
        title="Nova Igreja"
        description="Preencha os campos abaixo para criar uma nova igreja"
      />
      <UpsertChurchForm headquarters={headquarters} regionals={regionals} />
    </>
  );
}
