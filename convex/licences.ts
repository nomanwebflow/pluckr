import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/** By Google ID first. Polar can attach an order to a customer it already knew by email, so fall back to the (Google-verified) email. */
export const getActiveBySub = internalQuery({
  args: { sub: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, { sub, email }) => {
    const bySub = await ctx.db.query("licences").withIndex("by_sub", (q) => q.eq("sub", sub)).collect();
    const found = bySub.find((row) => row.status === "active");
    if (found || !email) return found ?? null;
    const byEmail = await ctx.db.query("licences").withIndex("by_email", (q) => q.eq("email", email)).collect();
    return byEmail.find((row) => row.status === "active") ?? null;
  },
});

export const recordConsent = internalMutation({
  args: { sub: v.string() },
  handler: async (ctx, { sub }) => {
    const existing = await ctx.db.query("consents").withIndex("by_sub", (q) => q.eq("sub", sub)).first();
    if (!existing) await ctx.db.insert("consents", { sub, acceptedAt: Date.now() });
  },
});

/** Idempotent per order, so webhook retries are harmless. A refund is final: a late "paid" replay cannot undo it. */
export const recordOrder = internalMutation({
  args: {
    sub: v.string(),
    email: v.optional(v.string()),
    orderId: v.string(),
    customerId: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("refunded")),
    paidAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("licences").withIndex("by_order", (q) => q.eq("polarOrderId", args.orderId)).unique();
    if (existing) {
      if (existing.status !== "refunded") await ctx.db.patch(existing._id, { status: args.status });
      return;
    }
    await ctx.db.insert("licences", {
      sub: args.sub,
      email: args.email,
      polarOrderId: args.orderId,
      polarCustomerId: args.customerId,
      status: args.status,
      paidAt: args.paidAt,
    });
  },
});

export const markRefunded = internalMutation({
  args: { orderId: v.string() },
  handler: async (ctx, { orderId }) => {
    const existing = await ctx.db.query("licences").withIndex("by_order", (q) => q.eq("polarOrderId", orderId)).unique();
    if (existing) await ctx.db.patch(existing._id, { status: "refunded" });
  },
});

/** Privacy requests: delete everything stored for one Google account. Run from the Convex dashboard. */
export const deleteBySub = internalMutation({
  args: { sub: v.string() },
  handler: async (ctx, { sub }) => {
    const rows = await ctx.db.query("licences").withIndex("by_sub", (q) => q.eq("sub", sub)).collect();
    for (const row of rows) await ctx.db.delete(row._id);
    const consents = await ctx.db.query("consents").withIndex("by_sub", (q) => q.eq("sub", sub)).collect();
    for (const row of consents) await ctx.db.delete(row._id);
    return rows.length;
  },
});
