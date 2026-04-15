import { z } from "zod";

export const churchFunctionFormSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "O campo é obrigatório"),
  description: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === "" || value === undefined ? null : value)),
});

export const createChurchFunctionSchema = churchFunctionFormSchema.omit({
  id: true,
});
export const updateChurchFunctionSchema = churchFunctionFormSchema;
export const deleteChurchFunctionSchema = churchFunctionFormSchema.pick({
  id: true,
});

export type ChurchFunctionFormSchema = z.infer<typeof churchFunctionFormSchema>;
export type CreateChurchFunctionSchema = z.infer<
  typeof createChurchFunctionSchema
>;
export type UpdateChurchFunctionSchema = z.infer<
  typeof updateChurchFunctionSchema
>;
export type DeleteChurchFunctionSchema = z.infer<
  typeof deleteChurchFunctionSchema
>;
