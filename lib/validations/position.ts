import { churchPosition } from "@/db/schema/people";
import z from "zod";

const formOptionalString = z
  .literal("")
  .transform(() => undefined)
  .or(z.string().optional());

const churchPositionSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: formOptionalString,
});

export const createChurchPositionSchema = churchPositionSchema;

export const updateChurchPositionSchema = churchPositionSchema.extend({
  id: z.uuid(),
});

export const deleteChurchPositionSchema = churchPositionSchema.extend({
  id: z.uuid(),
});

export type CreateChurchPositionInput = z.infer<
  typeof createChurchPositionSchema
>;
export type UpdateChurchPositionInput = z.infer<
  typeof updateChurchPositionSchema
>;
export type DeleteChurchPositionInput = z.infer<
  typeof deleteChurchPositionSchema
>;

export type ChurchPositionSchema = typeof churchPosition.$inferSelect;
