import { notFound } from "next/navigation";
import { UpsertChurchFunctionForm } from "../_components/upsert-function-form";
import { getChurchFunctionById } from "@/db/queries/function";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function EditChurchFunctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organizationId } = await getSessionContext();

  const churchFunction = await getChurchFunctionById(id, organizationId);

  if (!churchFunction) return notFound();

  return <UpsertChurchFunctionForm initialData={churchFunction} />;
}
