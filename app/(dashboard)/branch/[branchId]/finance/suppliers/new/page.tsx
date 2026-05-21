import { UpsertSupplierForm } from "@/modules/finance/suppliers/_components/upsert-form";

export default async function NewSupplierPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  return <UpsertSupplierForm branchId={branchId} />;
}
