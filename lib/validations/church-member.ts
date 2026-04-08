import { z } from "zod";
import { churchMember } from "@/db/schema/people";

const churchMemberSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  userId: z.uuid().optional(),
  churchPositionId: z.uuid().optional(),

  type: z.enum(["MEMBER", "VISITOR"]).default("MEMBER"),
  name: z.string().min(1, "Campo obrigatório"),
  birthDate: z.date().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  cpf: z.string().optional(),
  profession: z.string().optional(),

  email: z.email("Endereço de email inválido").optional(),
  phone: z.string().optional(),

  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  maritalStatus: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const insertChurchMemberSchema = churchMemberSchema.omit({
  id: true,
  organizationId: true,
});

export const updateChurchMemberSchema = churchMemberSchema.partial().omit({
  organizationId: true,
});

export const deleteChurchMemberSchema = churchMemberSchema.pick({
  id: true,
});

export type insertChurchMemberSchema = z.infer<typeof churchMemberSchema>;
export type updateChurchMemberSchema = z.infer<typeof churchMemberSchema>;
export type deleteChurchMemberSchema = z.infer<typeof churchMemberSchema>;

export type ChurchMemberSchema = typeof churchMember.$inferSelect;
