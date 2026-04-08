import { z } from "zod";

export const organizationFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Subdomínio deve ter pelo menos 3 caracteres"),
  type: z.enum(["headquarters", "regional", "local"]),
  path: z.string(),
});
