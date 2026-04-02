import { churchFunction } from "@/db/schema/people";
import z from "zod";

const churchFunctionSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  createdAt: z.date(),
});

export const insertChurchFunctionSchema = churchFunctionSchema.omit({
  id: true,
  organizationId: true,
  createdAt: true,
});

export const updateChurchFunctionSchema = churchFunctionSchema.omit({
  organizationId: true,
  createdAt: true,
});

export const deleteChurchFunctionSchema = churchFunctionSchema.pick({
  id: true,
});

export type InsertChurchFunction = z.infer<typeof insertChurchFunctionSchema>;
export type UpdateChurchFunction = z.infer<typeof updateChurchFunctionSchema>;
export type DeleteChurchFunction = z.infer<typeof deleteChurchFunctionSchema>;

export type ChurchFunctionSchema = typeof churchFunction.$inferSelect;
