import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { branch } from "./organization";
import { relations } from "drizzle-orm";

export const churchRole = pgTable(
  "church_role",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("churchRole_organizationId_idx").on(table.organizationId)],
);

export const churchFunction = pgTable(
  "church_function",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("churchFunction_organizationId_idx").on(table.organizationId),
  ],
);

export const churchMember = pgTable(
  "church_member",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    churchRoleId: uuid("church_role_id").references(() => churchRole.id, {
      onDelete: "set null",
    }),
    type: text("type").notNull().default("visitor"),
    name: text("name").notNull(),
    birthDate: timestamp("birth_date"),
    gender: text("gender"),
    maritalStatus: text("marital_status"),
    cpf: text("cpf").unique(),
    profession: text("profession"),
    photoUrl: text("photo_url"),
    phone: text("phone"),
    email: text("email").unique(),
    zipCode: text("zip_code"),
    street: text("street"),
    number: text("number"),
    complement: text("complement"),
    neighborhood: text("neighborhood"),
    city: text("city"),
    state: text("state"),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("churchMember_organizationId_idx").on(table.organizationId),
    index("churchMember_userId_idx").on(table.userId),
    index("churchMember_churchRoleId_idx").on(table.churchRoleId),
  ],
);

export const churchMemberFunction = pgTable(
  "church_member_function",
  {
    memberId: uuid("member_id")
      .notNull()
      .references(() => churchMember.id, { onDelete: "cascade" }),
    functionId: uuid("function_id")
      .notNull()
      .references(() => churchFunction.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.memberId, table.functionId] }),
    index("memberFunction_memberId_idx").on(table.memberId),
    index("memberFunction_functionId_idx").on(table.functionId),
  ],
);

export const churchMemberBranch = pgTable(
  "church_member_branch",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => churchMember.id, { onDelete: "cascade" }),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
  },
  (table) => [
    index("memberBranch_memberId_idx").on(table.memberId),
    index("memberBranch_branchId_idx").on(table.branchId),
  ],
);

export const churchMemberEvent = pgTable(
  "church_member_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => churchMember.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    description: text("description"),
    occurredAt: timestamp("occurred_at").defaultNow().notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("memberEvent_memberId_idx").on(table.memberId),
    index("memberEvent_type_idx").on(table.type),
    index("memberEvent_createdBy_idx").on(table.createdBy),
  ],
);

export const churchRoleRelations = relations(churchRole, ({ one, many }) => ({
  organization: one(organization, {
    fields: [churchRole.organizationId],
    references: [organization.id],
  }),
  members: many(churchMember),
}));

export const churchFunctionRelations = relations(
  churchFunction,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [churchFunction.organizationId],
      references: [organization.id],
    }),
    members: many(churchMember),
  }),
);

export const churchMemberRelations = relations(
  churchMember,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [churchMember.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [churchMember.userId],
      references: [user.id],
    }),
    churchRole: one(churchRole, {
      fields: [churchMember.churchRoleId],
      references: [churchRole.id],
    }),
    functions: many(churchMemberFunction),
    branches: many(churchMemberBranch),
    events: many(churchMemberEvent),
  }),
);

export const churchMemberFunctionRelations = relations(
  churchMemberFunction,
  ({ one }) => ({
    member: one(churchMember, {
      fields: [churchMemberFunction.memberId],
      references: [churchMember.id],
    }),
    function: one(churchFunction, {
      fields: [churchMemberFunction.functionId],
      references: [churchFunction.id],
    }),
  }),
);

export const churchMemberBranchRelations = relations(
  churchMemberBranch,
  ({ one }) => ({
    member: one(churchMember, {
      fields: [churchMemberBranch.memberId],
      references: [churchMember.id],
    }),
    branch: one(branch, {
      fields: [churchMemberBranch.branchId],
      references: [branch.id],
    }),
  }),
);

export const churchMemberEventRelations = relations(
  churchMemberEvent,
  ({ one }) => ({
    member: one(churchMember, {
      fields: [churchMemberEvent.memberId],
      references: [churchMember.id],
    }),
    createdBy: one(user, {
      fields: [churchMemberEvent.createdBy],
      references: [user.id],
    }),
  }),
);
