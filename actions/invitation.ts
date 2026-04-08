import { actionClient } from "@/lib/safe-action/safe-action";
import z from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const acceptInvitation = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1, "ID da convite é obrigatório"),
    }),
  )
  .action(async ({ parsedInput }) => {
    await auth.api.acceptInvitation({
      body: {
        invitationId: parsedInput.id,
      },
      headers: await headers(),
    });
  });
