import {
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { branch } from "./organization";
import { churchMember } from "./secretariat";
import { relations } from "drizzle-orm";

export const bank = pgTable("bank", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
});

export const financeAccount = pgTable(
  "finance_account",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: text("branch_id").references(() => branch.id),
    bankId: integer("bank_id").references(() => bank.id),
    name: text("name").notNull(),
    agency: text("agency"),
    account: text("account"),
    type: text("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_organizationId_idx").on(table.organizationId),
    index("account_branchId_idx").on(table.branchId),
    index("account_bankId_idx").on(table.bankId),
  ],
);

export const financeChartOfAccounts = pgTable(
  "finance_chart_of_accounts",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    parentId: text("parent_id"),
    name: text("name").notNull(),
    type: text("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.parentId], foreignColumns: [table.id] }),
    index("chart_of_accounts_organizationId_idx").on(table.organizationId),
    index("chart_of_accounts_parentId_idx").on(table.parentId),
  ],
);

export const financeCostCenter = pgTable(
  "finance_cost_center",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("cost_center_organizationId_idx").on(table.organizationId)],
);

export const financePerson = pgTable(
  "finance_person",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: text("branch_id").references(() => branch.id),
    churchMemberId: text("church_member_id").references(() => churchMember.id, {
      onDelete: "set null",
    }),
    type: text("type").notNull(),
    personType: text("person_type").notNull(),
    name: text("name").notNull(),
    companyName: text("company_name"),
    fantasyName: text("fantasy_name"),
    cpf: text("cpf").unique(),
    cnpj: text("cnpj").unique(),
    phone: text("phone"),
    email: text("email"),
    zipCode: text("zip_code"),
    address: text("address"),
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
  (table) => [
    index("person_organizationId_idx").on(table.organizationId),
    index("person_churchMemberId_idx").on(table.churchMemberId),
  ],
);

export const financeTransaction = pgTable(
  "finance_transaction",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: text("branch_id").references(() => branch.id),
    financeAccountId: text("finance_account_id")
      .notNull()
      .references(() => financeAccount.id),
    financeChartOfAccountId: text("finance_chart_of_account_id")
      .notNull()
      .references(() => financeChartOfAccounts.id),
    financePersonId: text("finance_person_id").references(
      () => financePerson.id,
    ),
    financeCostCenterId: text("finance_cost_center_id").references(
      () => financeCostCenter.id,
    ),
    type: text("type").notNull(),
    amount: numeric("amount").notNull(),
    description: text("description"),
    dueDate: timestamp("due_date"),
    paymentDate: timestamp("payment_date"),
    status: text("status").default("pending").notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("transaction_organizationId_idx").on(table.organizationId),
    index("transaction_branchId_idx").on(table.branchId),
    index("transaction_financeAccountId_idx").on(table.financeAccountId),
    index("transaction_financeChartOfAccountId_idx").on(
      table.financeChartOfAccountId,
    ),
    index("transaction_financeCostCenterId_idx").on(table.financeCostCenterId),
    index("transaction_financePersonId_idx").on(table.financePersonId),
    index("transaction_createdBy_idx").on(table.createdBy),
  ],
);

export const financeTransactionAttachment = pgTable(
  "finance_transaction_attachment",
  {
    id: text("id").primaryKey(),
    financeTransactionId: text("finance_transaction_id")
      .notNull()
      .references(() => financeTransaction.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("transaction_attachment_financeTransactionId_idx").on(
      table.financeTransactionId,
    ),
  ],
);

export const financeTransactionRelations = relations(
  financeTransaction,
  ({ one, many }) => ({
    financeAccount: one(financeAccount, {
      fields: [financeTransaction.financeAccountId],
      references: [financeAccount.id],
    }),
    financeChartOfAccount: one(financeChartOfAccounts, {
      fields: [financeTransaction.financeChartOfAccountId],
      references: [financeChartOfAccounts.id],
    }),
    financePerson: one(financePerson, {
      fields: [financeTransaction.financePersonId],
      references: [financePerson.id],
    }),
    financeCostCenter: one(financeCostCenter, {
      fields: [financeTransaction.financeCostCenterId],
      references: [financeCostCenter.id],
    }),
    createdBy: one(user, {
      fields: [financeTransaction.createdBy],
      references: [user.id],
    }),
    attachments: many(financeTransactionAttachment),
  }),
);

export const financeAccountRelations = relations(
  financeAccount,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [financeAccount.organizationId],
      references: [organization.id],
    }),
    branch: one(branch, {
      fields: [financeAccount.branchId],
      references: [branch.id],
    }),
    bank: one(bank, {
      fields: [financeAccount.bankId],
      references: [bank.id],
    }),
    transactions: many(financeTransaction),
  }),
);

export const financeChartOfAccountsRelations = relations(
  financeChartOfAccounts,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [financeChartOfAccounts.organizationId],
      references: [organization.id],
    }),
    parent: one(financeChartOfAccounts, {
      fields: [financeChartOfAccounts.parentId],
      references: [financeChartOfAccounts.id],
    }),
    transactions: many(financeTransaction),
    children: many(financeChartOfAccounts),
  }),
);

export const financePersonRelations = relations(
  financePerson,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [financePerson.organizationId],
      references: [organization.id],
    }),
    branch: one(branch, {
      fields: [financePerson.branchId],
      references: [branch.id],
    }),
    churchMember: one(churchMember, {
      fields: [financePerson.churchMemberId],
      references: [churchMember.id],
    }),
    transactions: many(financeTransaction),
  }),
);

export const financeCostCenterRelations = relations(
  financeCostCenter,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [financeCostCenter.organizationId],
      references: [organization.id],
    }),
    transactions: many(financeTransaction),
  }),
);

export const financeTransactionAttachmentRelations = relations(
  financeTransactionAttachment,
  ({ one }) => ({
    financeTransaction: one(financeTransaction, {
      fields: [financeTransactionAttachment.financeTransactionId],
      references: [financeTransaction.id],
    }),
  }),
);
