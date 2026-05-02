import { cookies } from "next/headers";

export async function getLastAccesedBranch() {
  const cookieStore = await cookies();

  return cookieStore.get("lastBranchId")?.value;
}

export async function setLastAccesedBranch(branchId: string) {
  const cookieStore = await cookies();

  cookieStore.set("lastBranchId", branchId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
