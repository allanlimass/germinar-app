import z from "zod";

export const branchMemberFormSchema = z.object({
  id: z
    .uuid()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  branchId: z
    .uuid()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
});

export type BranchMemberFormSchema = z.infer<typeof branchMemberFormSchema>;
