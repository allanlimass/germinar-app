import { notFound } from "next/navigation";
import { UpsertChurchPositionForm } from "../_components/upsert-position-form";
import { getChurchPositionById } from "@/db/queries/position";

export default async function EditChurchPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const churchPosition = await getChurchPositionById(id);

  if (!churchPosition) notFound();

  return <UpsertChurchPositionForm initialData={churchPosition} />;
}
