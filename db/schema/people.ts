import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { relations } from "drizzle-orm";

export const churchPosition = pgTable(
  "church_position",
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
    index("churchPosition_organizationId_idx").on(table.organizationId),
  ],
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

export const memberTypeEnum = pgEnum("member_type", ["MEMBER", "VISITOR"]);
export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const maritalStatusEnum = pgEnum("marital_status", [
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
]);
export const memberStatusEnum = pgEnum("member_status", ["ACTIVE", "INACTIVE"]);

export const churchMember = pgTable(
  "church_member",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    churchPositionId: uuid("church_position_id").references(
      () => churchPosition.id,
      {
        onDelete: "set null",
      },
    ),
    type: memberTypeEnum("type").default("MEMBER").notNull(),
    name: text("name").notNull(),
    birthDate: timestamp("birth_date"),
    gender: genderEnum("gender"),
    maritalStatus: maritalStatusEnum("marital_status"),
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
    status: memberStatusEnum("status").default("ACTIVE").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("churchMember_organizationId_idx").on(table.organizationId),
    index("churchMember_userId_idx").on(table.userId),
    index("churchMember_churchPositionId_idx").on(table.churchPositionId),
  ],
);

export const churchPositionRelations = relations(
  churchPosition,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [churchPosition.organizationId],
      references: [organization.id],
    }),
    members: many(churchMember),
  }),
);

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

export const churchMemberRelations = relations(churchMember, ({ one }) => ({
  organization: one(organization, {
    fields: [churchMember.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [churchMember.userId],
    references: [user.id],
  }),
  churchPosition: one(churchPosition, {
    fields: [churchMember.churchPositionId],
    references: [churchPosition.id],
  }),
}));
