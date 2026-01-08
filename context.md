# Project Context & Standards (A2SaaS)

## 1. The Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** Drizzle ORM + Neon (Serverless HTTP Driver)
- **Auth:** Clerk (abstracted and swappable)
- **API:** REST with Zod validation
- **Payments:** Stripe
- **Email:** Resend

## 2. Coding Principles

- **No Abstractions:** Do not create wrapper components unless explicitly asked. Use raw Tailwind or Shadcn primitives.
- **Type Safety:** NEVER use `any`. Always define Zod schemas for API input validation.
- **Simple REST:** Each route handles one resource. Use standard HTTP methods.
- **Server-First:** Prefer server components. Use client components only when interactivity is required.

## 3. Database

- Tables are defined in `src/server/db/schema.ts`.
- All tables use the `zero_stack_` prefix (configured in `createTable`).
- Use `varchar` for strings unless text length is truly unknown.
- Always add `createdAt` and `updatedAt` to new tables.

### Current Schema

```
users
├── id (PK)
├── clerkId (unique, indexed) — synced from Clerk webhook
├── email (unique)
├── name
├── imageUrl
├── createdAt
└── updatedAt

subscriptions
├── id (PK)
├── userId (FK → users, cascade delete)
├── stripeCustomerId (unique, indexed)
├── stripeSubscriptionId (unique)
├── status — "active", "inactive", "canceled", "past_due", etc.
├── priceId
├── currentPeriodEnd
├── createdAt
└── updatedAt
```

### Neon-First Patterns

- Uses `@neondatabase/serverless` HTTP driver.
- Connections are stateless/HTTP (no connection pooling needed).
- Import database: `import { db } from "@/server/db"`.

## 4. File Structure

```
src/
├── app/
│   ├── (auth)/                # Auth routes (minimal layout, no nav)
│   │   ├── layout.tsx         # Minimal layout (logo + theme toggle only)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (marketing)/           # Public routes (landing, pricing)
│   │   ├── layout.tsx         # Header/footer for marketing pages
│   │   ├── page.tsx           # Landing page
│   │   └── pricing/page.tsx   # Pricing page with checkout
│   ├── (app)/                 # Protected routes (dashboard)
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard home
│   │       └── profile/page.tsx
│   ├── setup/page.tsx         # Public setup status page
│   └── api/
│       ├── v1/
│       │   ├── checkout/route.ts  # Stripe checkout session
│       │   ├── users/me/route.ts
│       │   └── debug/health/route.ts
│       └── webhooks/
│           ├── clerk/route.ts
│           └── stripe/route.ts
├── components/
│   ├── auth/                  # Auth abstraction components
│   │   ├── index.ts           # Re-exports
│   │   ├── auth-provider.tsx  # Wraps app with auth context
│   │   └── sign-out-button.tsx
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── user-menu.tsx
│   │   └── mobile-sidebar.tsx
│   ├── ui/                    # Shadcn components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── server/
│   └── db/
│       ├── schema.ts          # Drizzle table definitions
│       ├── index.ts           # Database client
│       └── ensure-user.ts     # User provisioning helper
├── lib/
│   ├── auth/                  # Auth abstraction layer
│   │   ├── index.ts           # Main entry point (change imports here to swap)
│   │   ├── types.ts           # AuthUser, AuthAdapter interfaces
│   │   └── adapters/
│   │       └── clerk.ts       # Clerk implementation
│   ├── api.ts                 # success(), error(), handleApiError()
│   ├── config-status.ts       # Environment status utilities
│   ├── plans.ts               # Subscription plan definitions
│   ├── stripe.ts              # Stripe client
│   ├── resend.ts              # Resend client
│   └── utils.ts               # cn() helper
├── env.ts                     # Type-safe environment validation
└── proxy.ts                   # Auth middleware (Next.js 16)
```

## 5. API Response Helpers

Use the helpers from `@/lib/api` for consistent responses:

```typescript
import { success, error, handleApiError } from "@/lib/api";

// Success response
return success({ user: data }); // { data: { user: ... } }
return success(data, 201); // With custom status

// Error response
return error("Not found", 404); // { error: "Not found" }

// Catch-all error handler
try {
  // ... your code
} catch (err) {
  return handleApiError(err); // Handles ZodError specially
}
```

## 6. Webhooks

### Clerk Webhook (`/api/webhooks/clerk`)

Syncs users from Clerk to database. Handles:

- `user.created` — inserts new user
- `user.updated` — updates user data
- `user.deleted` — deletes user (cascades to subscriptions)

### Stripe Webhook (`/api/webhooks/stripe`)

Handles subscription lifecycle:

- `checkout.session.completed` — creates subscription after payment
- `customer.subscription.updated` — syncs subscription changes
- `customer.subscription.deleted` — marks subscription as canceled

## 7. Auth & Middleware

### Auth Abstraction Layer

Auth is abstracted to make provider swapping easier. The current provider is Clerk.

**Server-side auth** — use functions from `@/lib/auth`:

```typescript
import { getCurrentUser, getUserId } from "@/lib/auth";

// Get full user object
const user = await getCurrentUser();
// { id, email, name, imageUrl } or null

// Lightweight ID check
const userId = await getUserId();
```

**Client-side components** — use components from `@/components/auth`:

```typescript
import { AuthProvider, SignOutButton } from "@/components/auth";
```

### Swapping Auth Providers

To switch from Clerk to another provider (e.g., Auth.js):

1. Create new adapter at `src/lib/auth/adapters/authjs.ts`
2. Update `src/lib/auth/index.ts` to export the new adapter
3. Update `src/components/auth/` components for new provider
4. Replace `src/proxy.ts` with new middleware
5. Update sign-in/sign-up pages in `src/app/(auth)/`
6. Run database migration if auth ID column name changes

### Middleware (Next.js 16)

- Uses `proxy.ts` (Next.js 16 pattern, replaces `middleware.ts`)
- Protects all routes except public ones
- Public routes: `/`, `/pricing`, `/setup`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks(.*)`, `/api/v1/public(.*)`, `/api/v1/debug(.*)`
- Signed-in users are redirected from auth pages to `/dashboard`
- Auth pages redirect to `/setup` if Clerk is not configured

### User Provisioning

Use `ensureUser()` in protected pages to get the current user with subscription:

```typescript
import { ensureUser } from "@/server/db/ensure-user";

export default async function Page() {
  const user = await ensureUser();
  // user includes: id, email, name, imageUrl, createdAt, subscription
}
```

This uses the auth abstraction layer internally and handles just-in-time user creation if webhooks haven't synced yet.

## 8. Adding Features

**UI Component:**

```bash
npx shadcn@latest add button
```

**New API Route:**
Create `route.ts` in appropriate path under `src/app/api/v1/`.

**New Database Table:**

1. Add table definition to `src/server/db/schema.ts`
2. Add relations if needed
3. Run `npm run db:push`

## 9. Environment Variables

Type-safe env access via `src/env.ts`. All required variables:

| Variable                            | Description                   |
| ----------------------------------- | ----------------------------- |
| `DATABASE_URL`                      | Neon connection string        |
| `CLERK_SECRET_KEY`                  | Clerk secret                  |
| `CLERK_WEBHOOK_SECRET`              | Clerk webhook signing secret  |
| `STRIPE_SECRET_KEY`                 | Stripe secret                 |
| `STRIPE_WEBHOOK_SECRET`             | Stripe webhook signing secret |
| `RESEND_API_KEY`                    | Resend API key                |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key              |
| `NEXT_PUBLIC_APP_URL`               | App URL                       |

## 10. CLI Commands

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Development server (Turbopack) |
| `npm run build`     | Production build               |
| `npm run typecheck` | TypeScript checking            |
| `npm run lint`      | ESLint                         |
| `npm run db:push`   | Push schema to database        |
| `npm run db:studio` | Open Drizzle Studio            |

## 11. Deployment

```bash
# Preview
npx vercel deploy

# Production
npx vercel deploy --prod
```

Always verify build passes (`npm run build`) before deploying.

## 12. Config Status Utilities

Check environment configuration status without throwing errors:

```typescript
import { getConfigStatus } from "@/lib/config-status";

const config = getConfigStatus();
// config.database, config.clerk, config.stripe, etc. are booleans
```

Test database connectivity:

```typescript
import { testDbConnection } from "@/lib/config-status";

const result = await testDbConnection();
// { connected: boolean, error: string | null }
```

## 13. Theme System

Dark mode is handled by `next-themes`:

- `ThemeProvider` wraps the app in root layout
- `ThemeToggle` component for user switching
- System preference detection enabled
- Theme persisted in localStorage

## 14. Subscription Plans

Plan metadata is stored in code (`src/lib/plans.ts`) rather than the database. This keeps plan names, features, and pricing in sync between the pricing page and user profile.

```typescript
import { plans, getPlanName, getPlanByPriceId } from "@/lib/plans";

// Get plan name from Stripe price ID (for display)
getPlanName(subscription.priceId); // "Pro"

// Get full plan details
const plan = getPlanByPriceId(priceId);
// { id, name, price, period, description, priceId, features, highlighted }
```

**Why code instead of database?**

- Plan metadata rarely changes
- No extra database queries needed
- Single source of truth for pricing page and profile
- Easy to update: edit `plans.ts` and redeploy

**To add/modify plans:**

1. Create products and prices in Stripe Dashboard
2. Update `src/lib/plans.ts` with the new price IDs
3. Pricing page and profile will automatically reflect changes

## 15. Email Templates

Transactional emails use React Email templates with Resend:

```typescript
import { sendWelcomeEmail, sendSubscriptionEmail } from "@/lib/emails";

// Send welcome email (called automatically on user signup)
await sendWelcomeEmail(email, name);

// Send subscription confirmation (called automatically after checkout)
await sendSubscriptionEmail(email, name, planName);
```

**Email configuration:**

- From address: `RESEND_FROM_EMAIL` env var or fallback in `src/lib/site.ts`
- Templates: `src/lib/emails/` using React Email components

**To add a new email:**

1. Create template at `src/lib/emails/[name].tsx`
2. Add send function to `src/lib/emails/index.ts`
3. Call from webhook or API route
