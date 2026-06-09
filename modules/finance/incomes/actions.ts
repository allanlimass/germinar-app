"use server";

import { branchActionClient } from "@/lib/safe-action";
import {
  createIncomeSchema,
  deleteIncomeSchema,
  updateIncomeSchema,
} from "./schemas";
import { db } from "@/db";
import { financeTransaction } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

const path = (branchId: string) => `/branch/${branchId}/finance/incomes`;

export const createIncome = branchActionClient
  .inputSchema(createIncomeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      periodicity,
      periodicityRecurrenceFrequency,
      periodicityParcelledPeriod,
      periodicityParcelledQuantity,
      periodicityParcelledSplit,
      ...transactionData
    } = parsedInput;
    const { organizationId, branchId, session } = ctx;
    const createdBy = session.user.id;

    if (periodicity === "recorrent") {
      const recurrenceGroupId = crypto.randomUUID();
      const currentDate = parsedInput.dueDate;
      const recurrenceQuantity = 24;

      const incomes = [];

      const generateNextDate = (
        date: Date,
        frequency: string,
        index: number,
      ) => {
        switch (frequency) {
          case "daily":
            return addDays(date, index);
          case "weekly":
            return addWeeks(date, index);
          case "monthly":
            return addMonths(date, index);
          case "yearly":
            return addYears(date, index);
          default:
            return date;
        }
      };

      for (let i = 0; i < recurrenceQuantity; i++) {
        const dueDate = generateNextDate(
          currentDate || new Date(),
          periodicityRecurrenceFrequency || "",
          i,
        );

        incomes.push({
          ...transactionData,
          dueDate,
          recurrenceGroupId,
          recurrenceIndex: i + 1,
          createdBy,
          organizationId,
          branchId,
        });
      }

      await db.insert(financeTransaction).values(incomes);
    }

    await db.insert(financeTransaction).values({
      ...parsedInput,
      createdBy,
      organizationId,
      branchId,
    });

    revalidatePath(path(branchId));
  });

export const updateIncome = branchActionClient
  .inputSchema(updateIncomeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.update(financeTransaction).set({
      ...parsedInput,
      organizationId,
      branchId,
      createdBy: ctx.session.user.id,
    });

    revalidatePath(path(branchId));
  });

export const deleteIncome = branchActionClient
  .inputSchema(deleteIncomeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db
      .delete(financeTransaction)
      .where(
        and(
          eq(financeTransaction.id, parsedInput.id),
          eq(financeTransaction.organizationId, organizationId),
          eq(financeTransaction.branchId, branchId),
        ),
      );

    revalidatePath(path(branchId));
  });
