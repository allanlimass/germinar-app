import { z } from "zod";
import { churchFunction } from "@/db/schema/people";

const churchFunctionBase = z.object({
  name: z.string().min(1, "O campo é obrigatório"),
  description: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
});

export const createChurchFunctionSchema = churchFunctionBase;
export const updateChurchFunctionSchema = churchFunctionBase.extend({
  id: z.uuid(),
});
export const deleteChurchFunctionSchema = z.object({
  id: z.uuid(),
});

export type ChurchFunction = typeof churchFunction.$inferSelect;
export type CreateChurchFunctionSchema = z.input<
  typeof createChurchFunctionSchema
>;
export type UpdateChurchFunctionSchema = z.infer<
  typeof updateChurchFunctionSchema
>;
export type DeleteChurchFunctionSchema = z.infer<
  typeof deleteChurchFunctionSchema
>;
