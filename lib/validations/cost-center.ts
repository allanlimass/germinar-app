import { z } from "zod";

export const CostCenterFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export const createCostCenterSchema = CostCenterFormSchema.omit({ id: true });
export const updateCostCenterSchema = CostCenterFormSchema;
export const deleteCostCenterSchema = CostCenterFormSchema.pick({ id: true });

export type CostCenterFormSchema = z.infer<typeof CostCenterFormSchema>;
export type CreateCostCenterSchema = z.infer<typeof createCostCenterSchema>;
export type UpdateCostCenterSchema = z.infer<typeof updateCostCenterSchema>;
export type DeleteCostCenterSchema = z.infer<typeof deleteCostCenterSchema>;
