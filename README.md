# A2SaaS

The SaaS boilerplate built for the AI era. A minimal, type-safe foundation optimized for LLM context windows. Ships with auth, payments, and email fully wired—zero bloat.

## 🤖 Built for Agents

This repo includes a `context.md` file optimized for LLMs.
**Tip:** Add the contents of `context.md` to your Cursor "Project Rules" or `.cursorrules` file to give your AI perfect context on the architecture immediately.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** Drizzle ORM + Neon (Serverless PostgreSQL)
- **Auth:** Clerk (abstracted and swappable)
- **Payments:** Stripe
- **Email:** Resend
- **Validation:** Zod

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:

| Variable                            | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `DATABASE_URL`                      | Neon PostgreSQL connection string            |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                        |
| `CLERK_SECRET_KEY`                  | Clerk secret key                             |
| `CLERK_WEBHOOK_SECRET`              | Clerk webhook signing secret                 |
| `STRIPE_SECRET_KEY`                 | Stripe secret key                            |
| `STRIPE_WEBHOOK_SECRET`             | Stripe webhook signing secret                |
| `RESEND_API_KEY`                    | Resend API key                               |
| `NEXT_PUBLIC_APP_URL`               | Your app URL (e.g., `http://localhost:3000`) |

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Pages

| Route                | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `/`                  | Landing page with A2SaaS branding and setup status           |
| `/sign-in`           | Sign in page (redirects to `/setup` if Clerk not configured) |
| `/sign-up`           | Sign up page (redirects to `/setup` if Clerk not configured) |
| `/setup`             | Public setup dashboard showing configuration status          |
| `/pricing`           | Pricing page with Stripe checkout integration                |
| `/dashboard`         | Dashboard home with welcome message and setup progress       |
| `/dashboard/profile` | User profile with account info and subscription status       |

## Project Structure

```
src/
├── app/
│   ├── (auth)/                   # Auth routes (minimal layout, no nav)
│   │   ├── layout.tsx            # Minimal layout (logo + theme toggle)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (marketing)/              # Public routes (landing, pricing)
│   │   ├── layout.tsx            # Shared header/footer
│   │   ├── page.tsx              # Landing page
│   │   └── pricing/page.tsx      # Pricing page with checkout
│   ├── (app)/                    # Protected routes (dashboard)
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard home
│   │       └── profile/page.tsx  # User profile
│   ├── setup/page.tsx            # Public setup status page
│   ├── api/
│   │   ├── v1/
│   │   │   ├── checkout/route.ts # Create Stripe checkout session
│   │   │   ├── users/me/route.ts # Current user endpoint
│   │   │   └── debug/health/route.ts # Health check
│   │   └── webhooks/
│   │       ├── clerk/route.ts    # User sync webhook
│   │       └── stripe/route.ts   # Subscription webhook
│   └── layout.tsx                # Root layout with providers
├── components/
│   ├── auth/                     # Auth abstraction components
│   │   ├── index.ts              # Re-exports
│   │   ├── auth-provider.tsx     # Wraps app with auth context
│   │   └── sign-out-button.tsx   # Sign out button
│   ├── dashboard/                # Dashboard components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── user-menu.tsx
│   │   └── mobile-sidebar.tsx
│   ├── ui/                       # Shadcn components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── server/
│   └── db/
│       ├── index.ts              # Drizzle client
│       ├── schema.ts             # Table definitions
│       └── ensure-user.ts        # User provisioning helper
├── lib/
│   ├── auth/                     # Auth abstraction layer
│   │   ├── index.ts              # Main entry (swap providers here)
│   │   ├── types.ts              # AuthUser, AuthAdapter interfaces
│   │   └── adapters/clerk.ts     # Clerk implementation
│   ├── api.ts                    # API response helpers
│   ├── config-status.ts          # Environment status checker
│   ├── plans.ts                  # Subscription plan definitions
│   ├── resend.ts                 # Email client
│   ├── stripe.ts                 # Stripe client
│   └── utils.ts                  # Utility functions
├── env.ts                        # Type-safe env validation
└── proxy.ts                      # Auth middleware (Next.js 16)
```

## Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start development server with Turbopack |
| `npm run build`     | Build for production                    |
| `npm run start`     | Start production server                 |
| `npm run lint`      | Run ESLint                              |
| `npm run typecheck` | Run TypeScript type checking            |
| `npm run db:push`   | Push schema changes to database         |
| `npm run db:studio` | Open Drizzle Studio                     |

## API Routes

### REST API

| Method | Endpoint               | Description                                       |
| ------ | ---------------------- | ------------------------------------------------- |
| POST   | `/api/v1/checkout`     | Create Stripe checkout session (requires auth)    |
| GET    | `/api/v1/users/me`     | Get current authenticated user with subscription  |
| GET    | `/api/v1/debug/health` | Health check with environment and database status |

### Webhooks

| Endpoint               | Description                           |
| ---------------------- | ------------------------------------- |
| `/api/webhooks/clerk`  | Syncs Clerk users to database         |
| `/api/webhooks/stripe` | Handles subscription lifecycle events |

## Database Schema

Tables can optionally use a prefix configured via `DB_TABLE_PREFIX` env var.

### Users

| Column    | Type          | Description            |
| --------- | ------------- | ---------------------- |
| id        | varchar(128)  | Primary key            |
| clerkId   | varchar(256)  | Clerk user ID (unique) |
| email     | varchar(256)  | Email address (unique) |
| name      | varchar(256)  | Display name           |
| imageUrl  | varchar(1024) | Profile image URL      |
| createdAt | timestamp     | Creation timestamp     |
| updatedAt | timestamp     | Last update timestamp  |

### Subscriptions

| Column               | Type         | Description                     |
| -------------------- | ------------ | ------------------------------- |
| id                   | varchar(128) | Primary key                     |
| userId               | varchar(128) | Foreign key to users            |
| stripeCustomerId     | varchar(256) | Stripe customer ID (unique)     |
| stripeSubscriptionId | varchar(256) | Stripe subscription ID (unique) |
| status               | varchar(32)  | Subscription status             |
| priceId              | varchar(256) | Stripe price ID                 |
| currentPeriodEnd     | timestamp    | Subscription period end         |
| createdAt            | timestamp    | Creation timestamp              |
| updatedAt            | timestamp    | Last update timestamp           |

## Subscription Plans

Plan metadata is stored in code at `src/lib/plans.ts`. This keeps plan names, features, and prices in sync between the pricing page and profile display.

```typescript
import { plans, getPlanName, getPlanByPriceId } from "@/lib/plans";

// Get all plans for pricing page
plans.map((plan) => plan.name);

// Get plan name from Stripe price ID
getPlanName("price_xxx"); // "Pro"

// Get full plan details
getPlanByPriceId("price_xxx"); // { id, name, price, features, ... }
```

To add or modify plans:

1. Create products and prices in Stripe Dashboard
2. Update `src/lib/plans.ts` with the new price IDs
3. The pricing page and profile will automatically reflect changes

## Adding UI Components

Use Shadcn/UI to add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Auth Abstraction

Auth is abstracted to make provider swapping easier. The core app uses `@/lib/auth` for server-side auth and `@/components/auth` for client components.

### Server-side

```typescript
import { getCurrentUser, getUserId } from "@/lib/auth";

const user = await getCurrentUser(); // { id, email, name, imageUrl } or null
const userId = await getUserId(); // Just the ID (lightweight)
```

### Client-side

```typescript
import { AuthProvider, SignOutButton } from "@/components/auth";

// AuthProvider wraps the app in root layout
// SignOutButton renders the provider's sign-out UI
```

### Swapping Providers

To switch from Clerk to another provider (e.g., Auth.js):

1. Create new adapter at `src/lib/auth/adapters/authjs.ts`
2. Update `src/lib/auth/index.ts` to export the new adapter
3. Update `src/components/auth/` components for new provider
4. Replace `src/proxy.ts` with new middleware
5. Update sign-in/sign-up pages in `src/app/(auth)/`
6. Run database migration if auth ID column name changes

## Deployment

Deploy to Vercel:

```bash
npx vercel deploy --prod
```

## License

MIT
