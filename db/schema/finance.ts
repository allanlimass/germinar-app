import {
  boolean,
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth";
import { churchMember } from "./people";
import { relations } from "drizzle-orm";
import { branch } from "./organization";

export const bank = pgTable("bank", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
});

export const financeAccount = pgTable(
  "finance_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id),
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

export const financeChartOfAccountsType = pgEnum(
  "finance_chart_of_accounts_type",
  ["expense", "income"],
);

export const financeChartOfAccounts = pgTable(
  "finance_chart_of_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id),
    parentId: uuid("parent_id"),
    name: text("name").notNull(),
    type: financeChartOfAccountsType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.parentId], foreignColumns: [table.id] }),
    index("chart_of_accounts_organizationId_idx").on(table.organizationId),
    index("chart_of_accounts_branchId_idx").on(table.branchId),
    index("chart_of_accounts_parentId_idx").on(table.parentId),
  ],
);

export const financeCostCenter = pgTable(
  "finance_cost_center",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("cost_center_organizationId_idx").on(table.organizationId),
    index("cost_center_branchId_idx").on(table.branchId),
  ],
);

export const financeSupplier = pgTable(
  "finance_supplier",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id),
    isCompany: boolean("is_company").default(false).notNull(),
    name: text("name").notNull(),
    companyName: text("company_name"),
    fantasyName: text("fantasy_name"),
    cpf: text("cpf").unique(),
    cnpj: text("cnpj").unique(),
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
  (table) => [
    index("person_organizationId_idx").on(table.organizationId),
    index("person_branchId_idx").on(table.branchId),
  ],
);

export const financeTransactionType = pgEnum("finance_transaction_type", [
  "income",
  "expense",
  "transfer",
]);
export const financeTransactionStatus = pgEnum("finance_transaction_status", [
  "pending",
  "paid",
  "overdue",
  "canceled",
]);
export const financeTransactionSource = pgEnum("finance_transaction_source", [
  "manual",
  "import",
  "gateway",
]);

export const financeTransaction = pgTable(
  "finance_transaction",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id),
    financeAccountId: uuid("finance_account_id")
      .notNull()
      .references(() => financeAccount.id),
    financeChartOfAccountId: uuid("finance_chart_of_account_id")
      .notNull()
      .references(() => financeChartOfAccounts.id),
    financeCostCenterId: uuid("finance_cost_center_id").references(
      () => financeCostCenter.id,
    ),
    financeSupplierId: uuid("finance_supplier_id").references(
      () => financeSupplier.id,
    ),
    financeContributorId: uuid("finance_contributor_id").references(
      () => churchMember.id,
    ),
    type: financeTransactionType("type").notNull(),
    amount: numeric("amount").notNull(),
    description: text("description"),
    dueDate: timestamp("due_date"),
    paymentDate: timestamp("payment_date"),
    status: financeTransactionStatus("status").notNull().default("pending"),
    source: financeTransactionSource("source").notNull().default("manual"),
    externalId: text("external_id"),
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
    index("transaction_financeSupplierId_idx").on(table.financeSupplierId),
    index("transaction_financeContributorId_idx").on(
      table.financeContributorId,
    ),
    index("transaction_createdBy_idx").on(table.createdBy),
  ],
);

export const financeTransactionAttachment = pgTable(
  "finance_transaction_attachment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    financeTransactionId: uuid("finance_transaction_id")
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
    organization: one(organization, {
      fields: [financeTransaction.organizationId],
      references: [organization.id],
    }),
    branch: one(branch, {
      fields: [financeTransaction.branchId],
      references: [branch.id],
    }),
    financeAccount: one(financeAccount, {
      fields: [financeTransaction.financeAccountId],
      references: [financeAccount.id],
    }),
    financeChartOfAccount: one(financeChartOfAccounts, {
      fields: [financeTransaction.financeChartOfAccountId],
      references: [financeChartOfAccounts.id],
    }),
    financeSupplier: one(financeSupplier, {
      fields: [financeTransaction.financeSupplierId],
      references: [financeSupplier.id],
    }),
    financeContributor: one(churchMember, {
      fields: [financeTransaction.financeContributorId],
      references: [churchMember.id],
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
    branch: one(branch, {
      fields: [financeChartOfAccounts.branchId],
      references: [branch.id],
    }),
    parent: one(financeChartOfAccounts, {
      fields: [financeChartOfAccounts.parentId],
      references: [financeChartOfAccounts.id],
    }),
    transactions: many(financeTransaction),
    children: many(financeChartOfAccounts),
  }),
);

export const financeSupplierRelations = relations(
  financeSupplier,
  ({ one, many }) => ({
    organization: one(organization, {
      fields: [financeSupplier.organizationId],
      references: [organization.id],
    }),
    branch: one(branch, {
      fields: [financeSupplier.branchId],
      references: [branch.id],
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
    branch: one(branch, {
      fields: [financeCostCenter.branchId],
      references: [branch.id],
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
