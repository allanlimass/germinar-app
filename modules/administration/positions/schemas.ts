import { z } from "zod";
import { churchPosition } from "@/db/schema/people";

const churchPositionBase = z.object({
  name: z.string().min(1, "O campo é obrigatório"),
  description: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
});

export const createChurchPositionSchema = churchPositionBase;
export const updateChurchPositionSchema = churchPositionBase.extend({
  id: z.uuid(),
});
export const deleteChurchPositionSchema = z.object({
  id: z.uuid(),
});

export type ChurchPosition = typeof churchPosition.$inferSelect;
export type CreateChurchPositionSchema = z.input<
  typeof createChurchPositionSchema
>;
export type UpdateChurchPositionSchema = z.infer<
  typeof updateChurchPositionSchema
>;
export type DeleteChurchPositionSchema = z.infer<
  typeof deleteChurchPositionSchema
>;
