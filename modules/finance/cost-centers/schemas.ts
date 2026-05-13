import { z } from "zod";
import { financeCostCenter } from "@/db/schema/finance";

const costCenterBase = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export const createCostCenterSchema = costCenterBase;
export const updateCostCenterSchema = costCenterBase.extend({
  id: z.uuid(),
});
export const deleteCostCenterSchema = z.object({
  id: z.uuid(),
});

export type CostCenter = typeof financeCostCenter.$inferSelect;
export type CreateCostCenterSchema = z.input<typeof createCostCenterSchema>;
export type UpdateCostCenterSchema = z.infer<typeof updateCostCenterSchema>;
export type DeleteCostCenterSchema = z.infer<typeof deleteCostCenterSchema>;
