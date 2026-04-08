import { notFound } from "next/navigation";
import { UpsertChurchFunctionForm } from "../_components/upsert-function-form";
import { getChurchFunctionById } from "@/db/queries/function";

export default async function EditChurchFunctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const churchFunctionData = await getChurchFunctionById(id);

  if (!churchFunctionData) return notFound();

  return <UpsertChurchFunctionForm initialData={churchFunctionData} />;
}
