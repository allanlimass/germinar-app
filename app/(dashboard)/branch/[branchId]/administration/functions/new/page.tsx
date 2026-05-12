import { UpsertChurchFunctionForm } from "@/modules/administration/functions/_components/upsert-form";

export default async function NewChurchFunctionPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  return <UpsertChurchFunctionForm branchId={branchId} />;
}
