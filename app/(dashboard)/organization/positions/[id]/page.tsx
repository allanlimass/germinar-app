import { notFound } from "next/navigation";
import { UpsertChurchPositionForm } from "../_components/upsert-position-form";
import { getChurchPositionById } from "@/db/queries/position";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function EditChurchPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organizationId } = await getSessionContext();

  const churchPosition = await getChurchPositionById(id, organizationId);

  if (!churchPosition) notFound();

  return <UpsertChurchPositionForm initialData={churchPosition} />;
}
