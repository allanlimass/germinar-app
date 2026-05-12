import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { invitation, member } from "@/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { InvitationSchema } from "@/lib/validations/invitation";

export type UserAndInvitation = InvitationSchema;

export const listUsers = async (): Promise<UserAndInvitation[]> => {
  const { organizationId } = await getSessionContext();

  const members = await db.query.member.findMany({
    where: eq(member.organizationId, organizationId),
    with: {
      user: true,
    },
  });

  const invitations = await db.query.invitation.findMany({
    where: and(
      eq(invitation.organizationId, organizationId),
      eq(invitation.status, "pending"),
    ),
  });

  const result: UserAndInvitation[] = [
    ...members.map((m) => ({
      id: m.userId,
      organizationId: m.organizationId,
      email: m.user.email,
      name: m.user.name,
      role: m.role as InvitationSchema["role"],
      status: "accepted" as const,
      createdAt: m.createdAt,
    })),
    ...invitations.map((i) => ({
      id: i.id,
      organizationId: i.organizationId,
      email: i.email,
      name: i.email,
      role: (i.role as InvitationSchema["role"]) || "member",
      status: i.status as InvitationSchema["status"],
      createdAt: i.createdAt,
    })),
  ];

  return result;
};
