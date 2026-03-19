import { db } from "./index";
import { permission } from "./schema/organization";

const modules = [
  "members",
  "secretariat",
  "finance",
  "events",
  "communications",
];
const actions = ["create", "read", "update", "delete"];

const permissions = modules.flatMap((module) =>
  actions.map((action) => ({
    id: `${module}_${action}`,
    module,
    action,
    description: `Allows ${action}ing ${module}.`,
  })),
);

async function seed() {
  await db.insert(permission).values(permissions).onConflictDoNothing();
}

seed()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
