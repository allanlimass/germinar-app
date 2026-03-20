import { db } from "./index";
import { permission } from "./schema/organization";
import { bank } from "./schema/treasury";

interface Bank {
  name: string;
  code: number | null;
  logoUrl?: string;
}

const banks = async () => {
  try {
    const response = await fetch("https://brasilapi.com.br/api/banks/v1");
    if (!response.ok) throw new Error("Failed to fetch banks");

    const data = await response.json();

    return data
      .filter((bank: Bank) => bank.code !== null)
      .map((bank: Bank) => ({
        name: bank.name,
        code: bank.code,
      }));
  } catch (error) {
    console.error("Error getting banks:", error);
    return [];
  }
};

const MODULES = [
  "members",
  "secretariat",
  "finance",
  "events",
  "communications",
];
const ACTIONS = ["create", "read", "update", "delete"];

const permissions = MODULES.flatMap((module) =>
  ACTIONS.map((action) => ({
    id: `${module}_${action}`,
    module,
    action,
    description: `Allows ${action}ing ${module}.`,
  })),
);

const seed = async () => {
  await db
    .insert(bank)
    .values(await banks())
    .onConflictDoNothing();
  await db.insert(permission).values(permissions).onConflictDoNothing();
};

seed()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
