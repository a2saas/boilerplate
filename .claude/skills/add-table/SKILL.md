---
name: add-table
description: Add a new database table to A2SaaS. Use when the user wants to create a table, add a model, define a schema, or extend the database.
---

# Add Database Table

Add a new table to the Drizzle schema.

## First, Ask the User

Before creating the table, clarify:

1. **Table name**: What should the table be called? (e.g., "posts", "comments", "projects")
2. **Fields**: What columns does it need? (name, type, constraints)
3. **Relations**: Does it relate to users or other tables?

## Schema Location

All tables are defined in: `src/server/db/schema.ts`

## Table Template

```typescript
export const tableName = pgTable(
  withPrefix("table_name"),
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // Foreign key to users (if user-owned)
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Your fields here
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 32 }).default("active"),

    // Timestamps (always include these)
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  }
);
```

## Common Field Types

| Type | Usage |
|------|-------|
| `varchar("name", { length: N })` | Short strings (names, titles, status) |
| `text("name")` | Long text (descriptions, content) |
| `integer("name")` | Whole numbers |
| `boolean("name")` | True/false flags |
| `timestamp("name")` | Date/time values |
| `json("name")` | JSON data |

## Relations

If the table relates to users, add the relation:

```typescript
export const tableNameRelations = relations(tableName, ({ one }) => ({
  user: one(users, {
    fields: [tableName.userId],
    references: [users.id],
  }),
}));
```

Also update the users relations to include the new table:

```typescript
export const usersRelations = relations(users, ({ one, many }) => ({
  subscription: one(subscriptions),
  tableName: many(tableName),  // Add this
}));
```

## After Adding the Table

1. **Push the schema** to the database:
   ```bash
   npm run db:push
   ```

2. **Verify** in Drizzle Studio (optional):
   ```bash
   npm run db:studio
   ```

## Confirmation

After creating, confirm:
- Table added to schema.ts
- Relations defined (if applicable)
- Schema pushed to database
- No TypeScript errors
