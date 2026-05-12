import { UpsertChurchPositionForm } from "@/modules/administration/positions/_components/upsert-form";

export default async function NewChurchPositionPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  return <UpsertChurchPositionForm branchId={branchId} />;
}
