import { db } from "@/app/db";
import { usersTable } from "@/app/db/schema";

export default async function UsersPage() {
    const users = await db.query.usersTable.findMany();
    return (
        <div>
            <h1>Users</h1>  
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.email}</li>
                ))}
            </ul>
        </div>
    );
}