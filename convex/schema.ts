import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// One row per Polar order. A Google account (sub) is licensed while it has an "active" row.
export default defineSchema({
  licences: defineTable({
    sub: v.string(), // Google account ID, from the identity token
    email: v.optional(v.string()),
    polarOrderId: v.string(),
    polarCustomerId: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("refunded")),
    paidAt: v.number(),
  })
    .index("by_sub", ["sub"])
    .index("by_email", ["email"])
    .index("by_order", ["polarOrderId"]),
  // Proof that this Google account ticked "I agree to the Privacy Policy and Terms" before checkout.
  consents: defineTable({
    sub: v.string(),
    acceptedAt: v.number(),
  }).index("by_sub", ["sub"]),
});
