import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  index,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { relations } from "drizzle-orm";

export const branch = pgTable(
  "branch",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    isHeadquarters: boolean("is_headquarters").default(false).notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone"),
    email: text("email"),
    zipCode: text("zip_code"),
    street: text("street"),
    number: text("number"),
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

export const branchMember = pgTable(
  "branch_member",
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
    index("branchMember_branchId_idx").on(table.branchId),
    index("branchMember_userId_idx").on(table.userId),
  ],
);

export const permission = pgTable("permission", {
  id: uuid("id").primaryKey().defaultRandom(),
  module: text("module").notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
});

export const branchMemberPermission = pgTable(
  "branch_member_permission",
  {
    branchMemberId: uuid("branch_member_id")
      .notNull()
      .references(() => branchMember.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permission.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.branchMemberId, table.permissionId] }),
    index("branchMemberPermission_branchMemberId_idx").on(table.branchMemberId),
    index("branchMemberPermission_permissionId_idx").on(table.permissionId),
  ],
);

export const branchRelations = relations(branch, ({ one, many }) => ({
  organization: one(organization, {
    fields: [branch.organizationId],
    references: [organization.id],
  }),
  members: many(branchMember),
}));

export const branchMemberRelations = relations(
  branchMember,
  ({ one, many }) => ({
    branch: one(branch, {
      fields: [branchMember.branchId],
      references: [branch.id],
    }),
    user: one(user, { fields: [branchMember.userId], references: [user.id] }),
    permissions: many(branchMemberPermission),
  }),
);

export const permissionRelations = relations(permission, ({ many }) => ({
  branchMemberPermissions: many(branchMemberPermission),
}));

export const branchMemberPermissionRelations = relations(
  branchMemberPermission,
  ({ one }) => ({
    branchMember: one(branchMember, {
      fields: [branchMemberPermission.branchMemberId],
      references: [branchMember.id],
    }),
    permission: one(permission, {
      fields: [branchMemberPermission.permissionId],
      references: [permission.id],
    }),
  }),
);
