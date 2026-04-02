import z from "zod";
import { churchMember } from "@/db/schema/people";

const churchMemberSchema = z.object({
  id: churchMember.id,
});
