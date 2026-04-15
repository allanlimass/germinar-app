import { z } from "zod";

export const churchPositionFormSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "O campo é obrigatório"),
  description: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === "" || value === undefined ? null : value)),
});

export const createChurchPositionSchema = churchPositionFormSchema.omit({
  id: true,
});
export const updateChurchPositionSchema = churchPositionFormSchema;
export const deleteChurchPositionSchema = churchPositionFormSchema.pick({
  id: true,
});

export type ChurchPositionFormSchema = z.infer<typeof churchPositionFormSchema>;
export type CreateChurchPositionSchema = z.infer<
  typeof createChurchPositionSchema
>;
export type UpdateChurchPositionSchema = z.infer<
  typeof updateChurchPositionSchema
>;
export type DeleteChurchPositionSchema = z.infer<
  typeof deleteChurchPositionSchema
>;
