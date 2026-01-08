import { relations } from "drizzle-orm";
import { index, pgTableCreator, timestamp, varchar } from "drizzle-orm/pg-core";

const tablePrefix = process.env.DB_TABLE_PREFIX ?? "";
export const createTable = pgTableCreator((name) => `${tablePrefix}${name}`);

export const users = createTable(
  "users",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    clerkId: varchar("clerk_id", { length: 256 }).notNull().unique(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    name: varchar("name", { length: 256 }),
    imageUrl: varchar("image_url", { length: 1024 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("users_clerk_id_idx").on(table.clerkId)]
);

export const subscriptions = createTable(
  "subscriptions",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
      .notNull()
      .unique(),
    stripeSubscriptionId: varchar("stripe_subscription_id", {
      length: 256,
    }).unique(),
    status: varchar("status", { length: 32 }).notNull().default("inactive"),
    priceId: varchar("price_id", { length: 256 }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_stripe_customer_id_idx").on(table.stripeCustomerId),
  ]
);

export const usersRelations = relations(users, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
