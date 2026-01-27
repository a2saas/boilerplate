# A2SaaS v2 — Fresh Start Guide

This document contains everything needed to bootstrap a new A2SaaS repo from scratch, using REST + Zod instead of tRPC.

---

## Step 1: Create the Project

```bash
npx create-next-app@latest zero-stack --typescript --tailwind --eslint --app --src-dir
cd zero-stack
```

When prompted:

- Use TypeScript: Yes
- Use ESLint: Yes
- Use Tailwind CSS: Yes
- Use `src/` directory: Yes
- Use App Router: Yes
- Customize import alias: Yes (use `@/*`)

---

## Step 2: Install Dependencies

```bash
# Core
npm install drizzle-orm @neondatabase/serverless zod

# Auth
npm install @clerk/nextjs svix

# Payments & Email
npm install stripe resend

# UI utilities
npm install clsx tailwind-merge lucide-react class-variance-authority

# Dev
npm install -D drizzle-kit
```

---

## Step 3: Add Scripts to package.json

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Step 4: Environment Variables

Create `.env.example`:

```
# Database (Neon)
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Create `src/env.ts` for type-safe env access:

```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// EVERYTHING DONE ABOVE THIS LINE

export const env = envSchema.parse(process.env);
```

---

## Step 5: File Structure

```
src/
├── app/
│   ├── (marketing)/           # Public routes
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (app)/                 # Protected routes
│   │   ├── layout.tsx
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   ├── v1/                # REST API
│   │   │   └── users/
│   │   │       └── me/route.ts
│   │   └── webhooks/
│   │       ├── clerk/route.ts
│   │       └── stripe/route.ts
│   ├── layout.tsx
│   └── globals.css
├── server/
│   ├── db/
│   │   ├── index.ts           # Drizzle client
│   │   └── schema.ts          # Table definitions
│   └── services/              # Business logic (optional)
│       └── user.ts
├── lib/
│   ├── utils.ts               # cn() helper
│   ├── stripe.ts              # Stripe client
│   ├── resend.ts              # Resend client
│   └── api.ts                 # API response helpers
└── components/ui/             # Shadcn components
```

---

## Step 6: Core Files to Create

### `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["zero_stack_*"],
});
```

### `middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/v1/public(.*)", // Public API routes if needed
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### `src/server/db/index.ts`

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### `src/server/db/schema.ts`

```typescript
import { relations } from "drizzle-orm";
import { index, pgTableCreator, timestamp, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `zero_stack_${name}`);

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
```

### `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/lib/stripe.ts`

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

### `src/lib/resend.ts`

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);
```

### `src/lib/api.ts` — API Response Helpers

```typescript
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return error(err.errors[0]?.message ?? "Validation error", 400);
  }
  console.error(err);
  return error("Internal server error", 500);
}
```

---

## Step 7: Example REST API Route

### `src/app/api/v1/users/me/route.ts`

```typescript
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { success, error, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return error("Unauthorized", 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
      with: { subscription: true },
    });

    if (!user) {
      return error("User not found", 404);
    }

    return success(user);
  } catch (err) {
    return handleApiError(err);
  }
}
```

---

## Step 8: Webhooks (Copy from Old Repo)

The Clerk and Stripe webhook handlers are reusable. Copy:

- `src/app/api/webhooks/clerk/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

Just update imports if needed (remove `@/env` references if using direct `process.env`).

---

## Step 9: Auth Pages

### `src/app/(marketing)/sign-in/[[...sign-in]]/page.tsx`

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

### `src/app/(marketing)/sign-up/[[...sign-up]]/page.tsx`

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

---

## Step 10: Root Layout

### `src/app/layout.tsx`

```typescript
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "A2SaaS",
  description: "Minimal SaaS boilerplate for agentic development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Coding Standards (from context.md)

1. **No unnecessary abstractions** — Use raw Tailwind or Shadcn primitives
2. **Type safety** — Never use `any`. Use Zod for all API input validation
3. **Simple REST** — Each route handles one resource. Use standard HTTP methods
4. **Services layer (optional)** — For shared business logic, create `src/server/services/*.ts`
5. **Table prefix** — Drizzle tables can use an optional prefix via `DB_TABLE_PREFIX` env var

---

## API Pattern

```
GET    /api/v1/users/me          → Get current user
POST   /api/v1/checkout          → Create Stripe checkout session
GET    /api/v1/subscription      → Get subscription status
```

Each route:

1. Check auth with `auth()` from Clerk
2. Validate input with Zod (if needed)
3. Call database or service
4. Return with `success()` or `error()` helpers

---

## What's NOT Included (Add If Needed)

- React Query (only needed for client-side caching)
- Shadcn components (add with `npx shadcn@latest add button`)
- Email templates
- Error boundaries
- Loading states

---

## Agent Kickoff Prompt

Once the new repo is set up, use this prompt to start a coding session:

```
I'm starting a new coding session on A2SaaS.

This is a minimal SaaS boilerplate with:
- Next.js 15 (App Router)
- Clerk for auth
- Drizzle + Neon for database
- Stripe + Resend for payments/email
- REST API with Zod validation (no tRPC)

Please verify the app builds without errors, then ask me what we're building today.
```
