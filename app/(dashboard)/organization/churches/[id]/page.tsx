import { getSessionContext } from "@/lib/utils/db-utils";
import { UpsertChurchForm } from "../_components/upsert-church-form";
import { listChurchById, listChurchesByType } from "@/db/queries/churches";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function EditChurchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getSessionContext();

  const { id } = await params;

  const [church, headquarters, regionals] = await Promise.all([
    listChurchById(id),
    listChurchesByType("headquarters"),
    listChurchesByType("regional"),
  ]);

  return (
    <>
      <DashboardHeader
        title="Editar Igreja"
        description="Preencha os campos abaixo para editar a igreja"
      />
      <UpsertChurchForm
        initialData={church}
        headquarters={headquarters}
        regionals={regionals}
      />
    </>
  );
}
