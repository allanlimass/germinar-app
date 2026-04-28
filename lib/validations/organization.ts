import { z } from "zod";

export const organizationFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string(),
});

export const createOrganizationSchema = organizationFormSchema.omit({
  id: true,
  slug: true,
});

export const updateOrganizationSchema = organizationFormSchema.extend({});

export const deleteOrganizationSchema = z.object({
  id: z.string().uuid(),
});

export type OrganizationSchema = z.infer<typeof organizationFormSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;
