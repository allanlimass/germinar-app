import { churchRole } from "@/db/schema/people";
import z from "zod";

const churchRoleSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  createdAt: z.date(),
});

export const insertChurchRoleSchema = churchRoleSchema.omit({
  id: true,
  organizationId: true,
  createdAt: true,
});

export const updateChurchRoleSchema = churchRoleSchema.omit({
  organizationId: true,
  createdAt: true,
});

export const deleteChurchRoleSchema = churchRoleSchema.pick({ id: true });

export type InsertChurchRole = z.infer<typeof insertChurchRoleSchema>;
export type UpdateChurchRole = z.infer<typeof updateChurchRoleSchema>;
export type DeleteChurchRole = z.infer<typeof deleteChurchRoleSchema>;

export type ChurchRoleSchema = typeof churchRole.$inferSelect;
