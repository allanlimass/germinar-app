import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  index,
  boolean,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { relations } from "drizzle-orm";

export const branch = pgTable(
  "branch",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    isHeadquarter: boolean("is_headquarter").default(false).notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    cnpj: text("cnpj"),
    phone: text("phone"),
    email: text("email"),
    zipCode: text("zip_code"),
    street: text("street"),
    number: text("number"),
    complement: text("complement"),
    neighborhood: text("neighborhood"),
    city: text("city"),
    state: text("state"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("branch_organizationId_idx").on(table.organizationId)],
);

export const branchUser = pgTable(
  "branch_user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("branchUser_branchId_idx").on(table.branchId),
    index("branchUser_userId_idx").on(table.userId),
  ],
);

export const permission = pgTable(
  "permission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    module: text("module").notNull(),
    action: text("action").notNull(),
    description: text("description").notNull(),
  },
  (table) => [
    uniqueIndex("permission_module_action_idx").on(table.module, table.action),
  ],
);

export const branchUserPermission = pgTable(
  "branch_member_permission",
  {
    branchUserId: uuid("branch_member_id")
      .notNull()
      .references(() => branchUser.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permission.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.branchUserId, table.permissionId] }),
    index("branchUserPermission_branchUserId_idx").on(table.branchUserId),
    index("branchUserPermission_permissionId_idx").on(table.permissionId),
  ],
);

export const branchRelations = relations(branch, ({ one, many }) => ({
  organization: one(organization, {
    fields: [branch.organizationId],
    references: [organization.id],
  }),
  members: many(branchUser),
}));

export const branchUserRelations = relations(branchUser, ({ one, many }) => ({
  branch: one(branch, {
    fields: [branchUser.branchId],
    references: [branch.id],
  }),
  user: one(user, { fields: [branchUser.userId], references: [user.id] }),
  permissions: many(branchUserPermission),
}));

export const permissionRelations = relations(permission, ({ many }) => ({
  branchUserPermissions: many(branchUserPermission),
}));

export const branchUserPermissionRelations = relations(
  branchUserPermission,
  ({ one }) => ({
    branchUser: one(branchUser, {
      fields: [branchUserPermission.branchUserId],
      references: [branchUser.id],
    }),
    permission: one(permission, {
      fields: [branchUserPermission.permissionId],
      references: [permission.id],
    }),
  }),
);
