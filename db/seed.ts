import { db } from "./index";
import { permission } from "./schema/organization";
import { bank } from "./schema/finance";

interface Bank {
  code: number;
  name: string;
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
        id: bank.code,
        name: bank.name,
        logoUrl: bank.logoUrl,
      }));
  } catch (error) {
    console.error("Error getting banks:", error);
    return [];
  }
};

const MODULES = ["people", "finance"];
const ACTIONS = ["create", "read", "update", "delete"];

const permissions = MODULES.flatMap((module) =>
  ACTIONS.map((action) => ({
    module,
    action,
    description: `Allows ${action}ing ${module}.`,
  })),
);

const seed = async () => {
  await db.insert(permission).values(permissions).onConflictDoNothing();
  await db
    .insert(bank)
    .values(await banks())
    .onConflictDoNothing();
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
