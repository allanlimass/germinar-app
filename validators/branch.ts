import { z } from "zod";

export const branchFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  organizationId: z.string(),
});
