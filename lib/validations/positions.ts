import { churchPosition } from "@/db/schema/people";
import z from "zod";

const churchPositionSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  createdAt: z.date(),
});

export const insertChurchPositionSchema = churchPositionSchema.omit({
  id: true,
  organizationId: true,
  createdAt: true,
});

export const updateChurchPositionSchema = churchPositionSchema.omit({
  organizationId: true,
  createdAt: true,
});

export const deleteChurchPositionSchema = churchPositionSchema.pick({
  id: true,
});

export type InsertChurchPosition = z.infer<typeof insertChurchPositionSchema>;
export type UpdateChurchPosition = z.infer<typeof updateChurchPositionSchema>;
export type DeleteChurchPosition = z.infer<typeof deleteChurchPositionSchema>;

export type ChurchPositionSchema = typeof churchPosition.$inferSelect;
