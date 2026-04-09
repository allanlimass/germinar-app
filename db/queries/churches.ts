import { db } from "..";
import { asc, eq, inArray } from "drizzle-orm";
import { organization, member as memberSchema } from "@/db/schema/auth";

export const listChurchesByUserId = async (userId: string) => {
  const members = await db.query.member.findMany({
    where: eq(memberSchema.userId, userId),
  });

  if (members.length === 0) {
    return [];
  }

  const organizationIds = members.map((m) => m.organizationId);

  const churches = await db.query.organization.findMany({
    where: inArray(organization.id, organizationIds),
    orderBy: [asc(organization.name)],
  });

  return churches;
};

export const listChurchById = async (id: string) => {
  const church = await db.query.organization.findFirst({
    where: eq(organization.id, id),
  });

  if (!church) {
    throw new Error("Igreja não encontrada.");
  }

  return church;
};

export const listChurchesByType = async (
  type: "headquarters" | "regional" | "local",
) => {
  return db.query.organization.findMany({
    where: eq(organization.type, type),
    orderBy: [asc(organization.name)],
    columns: {
      id: true,
      name: true,
      path: true,
    },
  });
};
