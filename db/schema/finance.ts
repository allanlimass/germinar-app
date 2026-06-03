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

export const accountType = pgEnum("account_type", [
  "checking",
  "savings",
  "cash",
]);

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
    type: accountType("type").notNull(),
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
]);
export const financeTransactionStatus = pgEnum("finance_transaction_status", [
  "pending",
  "paid",
  "overdue",
]);
export const financeTransactionSource = pgEnum("finance_transaction_source", [
  "manual",
  "import",
  "gateway",
]);

export const financePaymentMethod = pgEnum("finance_payment_method", [
  "credit_card",
  "debit_card",
  "cash",
  "check",
  "bank_slip",
  "pix",
  "transfer",
  "other",
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
    financeChartOfAccountId: uuid("finance_chart_of_account_id").references(
      () => financeChartOfAccounts.id,
    ),
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
    paymentMethod: financePaymentMethod("payment_method"),
    status: financeTransactionStatus("status").notNull().default("pending"),
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

export const financeTransactionTransfer = pgTable(
  "finance_transaction_transfer",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id),
    fromAccountId: uuid("from_account_id")
      .notNull()
      .references(() => financeAccount.id, { onDelete: "restrict" }),
    toAccountId: uuid("to_account_id")
      .notNull()
      .references(() => financeAccount.id, { onDelete: "restrict" }),
    amount: numeric("amount").notNull(),
    description: text("description"),
    date: timestamp("date").notNull(),
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
    index("transaction_transfer_organizationId_idx").on(table.organizationId),
    index("transaction_transfer_branchId_idx").on(table.branchId),
    index("transaction_transfer_fromAccountId_idx").on(table.fromAccountId),
    index("transaction_transfer_toAccountId_idx").on(table.toAccountId),
    index("transaction_transfer_createdBy_idx").on(table.createdBy),
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
    transfersFrom: many(financeTransactionTransfer, {
      relationName: "from_account",
    }),
    transfersTo: many(financeTransactionTransfer, {
      relationName: "to_account",
    }),
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

export const financeTransactionTransferRelations = relations(
  financeTransactionTransfer,
  ({ one }) => ({
    organization: one(organization, {
      fields: [financeTransactionTransfer.organizationId],
      references: [organization.id],
    }),
    branch: one(branch, {
      fields: [financeTransactionTransfer.branchId],
      references: [branch.id],
    }),
    fromAccount: one(financeAccount, {
      fields: [financeTransactionTransfer.fromAccountId],
      references: [financeAccount.id],
    }),
    toAccount: one(financeAccount, {
      fields: [financeTransactionTransfer.toAccountId],
      references: [financeAccount.id],
    }),
    createdBy: one(user, {
      fields: [financeTransactionTransfer.createdBy],
      references: [user.id],
    }),
  }),
);
