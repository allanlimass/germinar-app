import { getChurchMembers } from "@/db/queries/church-member";
import { notFound } from "next/navigation";

export default async function MembershipPage() {
  const churchMembers = await getChurchMembers();

  if (!churchMembers) notFound();

  return (
    <div>
      {churchMembers.map((member) => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
