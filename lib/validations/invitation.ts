import z from "zod";

export const invitationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string().optional(),
  email: z.email("E-mail inválido"),
  role: z.enum(["owner", "member", "admin", "secretary", "treasurer"], {
    error: "Perfil é obrigatório",
  }),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
  createdAt: z.date(),
});

export const insertInvitationSchema = invitationSchema.omit({
  id: true,
  organizationId: true,
  status: true,
  createdAt: true,
});

export const updateInvitationSchema = invitationSchema.partial().omit({
  id: true,
  organizationId: true,
  createdAt: true,
});

export const deleteInvitationSchema = invitationSchema.pick({
  id: true,
});

export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type UpdateInvitation = z.infer<typeof updateInvitationSchema>;
export type DeleteInvitation = z.infer<typeof deleteInvitationSchema>;

export type InvitationSchema = z.infer<typeof invitationSchema>;
