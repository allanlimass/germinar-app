import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { financeSupplier } from "@/db/schema/finance";

export const getSuppliers = async (
  organizationId: string,
  branchId: string,
) => {
  return await db.query.financeSupplier.findMany({
    where: and(
      eq(financeSupplier.organizationId, organizationId),
      eq(financeSupplier.branchId, branchId),
    ),
  });
};

export const getSupplierById = async (
  organizationId: string,
  branchId: string,
  id: string,
) => {
  return await db.query.financeSupplier.findFirst({
    where: and(
      eq(financeSupplier.organizationId, organizationId),
      eq(financeSupplier.branchId, branchId),
      eq(financeSupplier.id, id),
    ),
  });
};
