import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

function stripNulls(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      v === null
        ? undefined
        : typeof v === "object" && v !== null
          ? stripNulls(v as Record<string, unknown>)
          : v,
    ]),
  );
}

export function nullSafeZodResolver<T extends z.ZodTypeAny>(schema: T) {
  const base = zodResolver(schema);
  return async (values: unknown, ctx: unknown, options: unknown) => {
    const result = await (base as Function)(values, ctx, options);
    if (result.values) {
      result.values = stripNulls(result.values as Record<string, unknown>);
    }
    return result;
  };
}
